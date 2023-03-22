import {ExtendedSavedOrder, SortProps} from "chums-types";
import {FilterOrderStatus, FulfillmentErrorList, FulfillmentList, OrdersAgeList, ShopifyOrdersTable} from "../types";
import {createReducer} from "@reduxjs/toolkit";
import addDays from 'date-fns/addDays'
import {getPreference, localStorageKeys, sessionStorageKeys, setPreference} from "../../api/preferences";
import {buildFulfillmentsList, buildOrdersAges, defaultOrdersSorter} from "./utils";
import {
    fulfillAllOrders,
    loadOrders,
    setCreatedMax,
    setCreatedMin,
    setFilterStatus,
    setPage,
    setRowsPerPage,
    setSort
} from "./actions";
import {fulfillOrder, importOrder, linkOrder, loadOrder} from "../current-order/actions";

export interface OrdersState {
    list: ExtendedSavedOrder[];
    loading: boolean;
    status: FilterOrderStatus;
    created_at_min: string | null;
    created_at_max: string | null;
    page: number;
    rowsPerPage: number;
    sort: SortProps<ShopifyOrdersTable>;
    fulfillments: FulfillmentList;
    errors: FulfillmentErrorList;
    ages: OrdersAgeList;
    importing: string | number | null;
}

export const initialOrdersState = (): OrdersState => ({
    list: [],
    loading: false,
    status: 'open',
    created_at_min: getPreference(sessionStorageKeys.fromDate, addDays(new Date(), -14).toISOString()),
    created_at_max: getPreference(sessionStorageKeys.toDate, null),
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.rowsPerPage, 25),
    sort: {field: "sage_SalesOrderNo", ascending: true},
    fulfillments: {},
    errors: {},
    ages: {},
    importing: null,
})


const ordersReducer = createReducer(initialOrdersState, (builder) => {
    builder
        .addCase(loadOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.page = 0;
            state.list = action.payload.sort(defaultOrdersSorter);
            state.fulfillments = buildFulfillmentsList(action.payload);
            state.ages = buildOrdersAges(action.payload);
        })
        .addCase(loadOrders.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadOrder.pending, (state, action) => {
            if (action.meta.arg) {
                state.list = [
                    ...state.list.filter(row => row.id !== action.meta.arg?.id),
                    {...action.meta.arg, import_status: action.meta.arg.import_status === 'waiting' ? 'pending' : action.meta.arg.import_status}
                ].sort(defaultOrdersSorter)
            }

        })
        .addCase(loadOrder.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(row => row.id !== action.payload?.id),
                    action.payload
                ].sort(defaultOrdersSorter)
            }
        })
        .addCase(setFilterStatus, (state, action) => {
            state.status = action.payload;
        })
        .addCase(setCreatedMin, (state, action) => {
            setPreference(sessionStorageKeys.fromDate, action.payload?.toISOString() ?? null);
            state.created_at_min = action.payload?.toISOString() ?? null;
        })
        .addCase(setCreatedMax, (state, action) => {
            setPreference(sessionStorageKeys.toDate, action.payload?.toISOString() ?? null);
            state.created_at_max = action.payload?.toISOString() ?? null;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            setPreference(localStorageKeys.rowsPerPage, action.payload);
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(importOrder.pending, (state, action) => {
            state.importing = action.meta.arg.id;
        })
        .addCase(importOrder.fulfilled, (state, action) => {
            state.importing = null;
            const others = state.list.filter(row => Number(row.id) !== Number(action.meta.arg.id));
            if (action.payload) {
                state.list = [...others, action.payload].sort(defaultOrdersSorter);
                state.fulfillments = buildFulfillmentsList(state.list);
            } else {
                state.list = [...others].sort(defaultOrdersSorter);
            }
        })
        .addCase(importOrder.rejected, (state) => {
            state.importing = null;
        })
        .addCase(linkOrder.fulfilled, (state, action) => {
            const others = state.list.filter(row => Number(row.id) !== Number(action.payload?.id ?? 0));
            if (action.payload) {
                state.list = [...others, action.payload].sort(defaultOrdersSorter);
                state.fulfillments = buildFulfillmentsList(state.list);
            } else {
                state.list = [...others].sort(defaultOrdersSorter);
            }
        })
        .addCase(fulfillOrder.pending, (state, action) => {
            state.fulfillments[Number(action.meta.arg)] = 'sending';
            delete state.errors[Number(action.meta.arg)];
        })
        .addCase(fulfillOrder.fulfilled, (state, action) => {
            state.fulfillments[Number(action.meta.arg)] = 'fulfilled';
        })
        .addCase(fulfillOrder.rejected, (state, action) => {
            state.fulfillments[Number(action.meta.arg)] = 'error';
            if (action.error?.message) {
                state.errors[Number(action.meta.arg)] = action.error.message;
            }
        })
        .addCase(fulfillAllOrders.pending, (state) => {
            state.list.filter(row => !!row.InvoiceNo)
                .forEach(row => {
                    state.fulfillments[Number(row.id)] = 'pending';
                });
        })
});

export default ordersReducer;
