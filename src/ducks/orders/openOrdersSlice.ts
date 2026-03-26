import type {SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, isAnyOf, type PayloadAction} from "@reduxjs/toolkit";
import type {ShopifyOrderRow} from "@/ducks/types.ts";
import {loadOrders} from "@/ducks/orders/actions.ts";
import {dismissAlert} from "@/ducks/alerts";
import {fulfillOrder, importOrder, linkOrder, loadOrder} from "@/ducks/current-order/actions.ts";
import {buildOrdersAges, orderSorter} from "@/ducks/orders/utils.ts";
import type {OrderDisplayFulfillmentStatus} from "chums-types/shopify-graphql";
import {LocalStore} from "@chumsinc/ui-utils";
import {rowsPerPageKey} from "@/utils/utils.ts";

const adapter = createEntityAdapter<ShopifyOrderRow, string>({
    selectId: (arg) => `${arg.id}`,
    sortComparer: (a, b) => `${b.id}`.localeCompare(`${a.id}`),
})

const selectors = adapter.getSelectors();

export interface OrdersSliceState {
    status: 'idle' | 'loading' | 'rejected';
    sort: SortProps<ShopifyOrderRow>;
    search: string;
    page: number;
    rowsPerPage: number;
}

const extraState: OrdersSliceState = {
    status: 'idle',
    sort: {field: 'sage_SalesOrderNo', ascending: true},
    search: '',
    page: 0,
    rowsPerPage: LocalStore.getItem<number>(rowsPerPageKey, 25),
}

const openOrdersSlice = createSlice({
    name: 'open-orders',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<ShopifyOrderRow>>) => {
            state.sort = action.payload;
            state.page = 0;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.page = 0;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context === loadOrders.typePrefix) {
                    state.status = 'idle';
                }
            })
            .addCase(fulfillOrder.fulfilled, (state, action) => {
                if (action.payload?.fulfillment?.status === 'SUCCESS') {
                    const order = selectors.selectById(state, action.payload.fulfillment.legacyResourceId);
                    if (order && order.graphqlOrder) {
                        adapter.updateOne(state, {
                            id: action.payload.fulfillment.legacyResourceId,
                            changes: {
                                graphqlOrder: {
                                    ...order.graphqlOrder,
                                    displayFulfillmentStatus: 'FULFILLED' as OrderDisplayFulfillmentStatus.Fulfilled
                                },
                            }
                        })
                    }
                } else if (action.payload?.error) {
                    const order = selectors.selectById(state, `${action.meta.arg}`);
                    if (order && order.graphqlOrder) {
                        adapter.updateOne(state, {
                            id: `${action.meta.arg}`,
                            changes: {
                                graphqlOrder: {
                                    ...order.graphqlOrder,
                                    displayFulfillmentStatus: 'REQUEST_DECLINED' as OrderDisplayFulfillmentStatus.RequestDeclined
                                },
                            }
                        })
                    }
                }

            })
            .addAsyncThunk(loadOrders, {
                pending: (state) => {
                    state.status = 'loading';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload)
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
            .addMatcher(isAnyOf(loadOrder.fulfilled, importOrder.fulfilled, linkOrder.fulfilled),
                (state, action) => {
                    if (action.payload) {
                        adapter.upsertOne(state, action.payload);
                    }
                })
    },
    selectors: {
        selectAllOrders: (state) => selectors.selectAll(state),
        selectOrdersStatus: (state) => state.status,
        selectOrdersSearch: (state) => state.search,
        selectOrdersSort: (state) => state.sort,
        selectOrdersPage: (state) => state.page,
        selectOrdersRowsPerPage: (state) => state.rowsPerPage,
    }
});

export default openOrdersSlice;
export const {setSort, setSearch, setPage, setRowsPerPage} = openOrdersSlice.actions;
export const {selectAllOrders, selectOrdersStatus, selectOrdersSearch, selectOrdersSort, selectOrdersRowsPerPage, selectOrdersPage} = openOrdersSlice.selectors;

export const selectSortedOrders = createSelector(
    [selectAllOrders, selectOrdersSearch, selectOrdersSort],
    (list, search, sort) => {
        return list
            .filter(order => !search || order.sage_SalesOrderNo.toLowerCase().includes(search.toLowerCase()))
            .sort(orderSorter(sort))
    });

export const selectOrdersAges = createSelector(
    [selectAllOrders],
    (orders) => {
        return buildOrdersAges(orders);
    }
)
