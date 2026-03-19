import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import type {OrderDisplayFulfillmentStatus} from "chums-types/shopify-graphql";
import {loadOrders} from "@/ducks/orders/actions.ts";
import {fulfillOrder, loadOrder} from "@/ducks/current-order/actions.ts";
import {selectCurrentOrder} from "@/ducks/current-order";

export interface OrderFulfillment {
    id: string;
    status: OrderDisplayFulfillmentStatus;
    invoiceNo: string | null;
    message?: string | null;
}

const adapter = createEntityAdapter<OrderFulfillment, string>({
    selectId: order => order.id,
    sortComparer: (a, b) => a.id.localeCompare(b.id),
})

const selectors = adapter.getSelectors();

const fulfillmentStatusSlice = createSlice({
    name: 'fulfillmentStatus',
    initialState: adapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadOrders.fulfilled, (state, action) => {
                const orders = action.payload.filter(order => order.graphqlOrder)
                    .map(order => ({
                        id: `${order.graphqlOrder!.legacyResourceId}`,
                        status: order.graphqlOrder!.displayFulfillmentStatus ?? 'UNFULFILLED',
                        invoiceNo: order.InvoiceNo ?? null,
                    }))
                adapter.setAll(state, orders);
            })
            .addCase(loadOrder.fulfilled, (state, action) => {
                if (action.payload?.graphqlOrder) {
                    const order = {
                        id: `${action.payload.graphqlOrder.legacyResourceId}`,
                        status: action.payload.graphqlOrder.displayFulfillmentStatus ?? 'UNFULFILLED' as OrderDisplayFulfillmentStatus.Unfulfilled,
                        invoiceNo: action.payload.InvoiceNo,
                    }
                    adapter.setOne(state, order);
                }
            })
            .addAsyncThunk(fulfillOrder, {
                pending: (state, action) => {
                    adapter.updateOne(state, {
                        id: `${action.meta.arg}`,
                        changes: {
                            status: 'PENDING_FULFILLMENT' as OrderDisplayFulfillmentStatus.PendingFulfillment,
                        }
                    })
                },
                fulfilled: (state, action) => {
                    adapter.updateOne(state, {
                        id: `${action.meta.arg}`,
                        changes: {
                            status: action.payload?.fulfillment?.status === 'SUCCESS'
                                ? 'FULFILLED' as OrderDisplayFulfillmentStatus.Fulfilled
                                : 'REQUEST_DECLINED' as OrderDisplayFulfillmentStatus.RequestDeclined,
                            message: action.payload?.error?.message ?? null,
                        }
                    })
                },
                rejected: (state, action) => {
                    adapter.updateOne(state, {
                        id: `${action.meta.arg}`,
                        changes: {
                            status: 'REQUEST_DECLINED' as OrderDisplayFulfillmentStatus.RequestDeclined,
                            message: action.error.message
                        }
                    })
                }
            })
    },
    selectors: {
        selectAllFulfillments: (state) => selectors.selectAll(state),
        selectFulfillmentById: (state, id: string) => selectors.selectById(state, id)
    }
});

export default fulfillmentStatusSlice;
export const {selectAllFulfillments, selectFulfillmentById} = fulfillmentStatusSlice.selectors;

export const selectAvailableFulfillments = createSelector(
    [selectAllFulfillments],
    (list) => {
        return list.filter(order => !!order.invoiceNo)
    }
)

export const selectNextPendingFulfillment = createSelector(
    [selectAvailableFulfillments],
    (list) => {
        return list.filter(order => order.status === 'UNFULFILLED')
    });

export const selectCurrentFulfillment = createSelector(
    [selectAllFulfillments, selectCurrentOrder],
    (list, current) => {
        return list.find(order => order.id === `${current?.id}`) ?? null
    }
)
