import type {ExtendedSavedOrder, SortProps} from "chums-types";
import type {FilterOrderStatus, FulfillmentErrorList, FulfillmentList, OrdersAgeList} from "../types";
import {createReducer} from "@reduxjs/toolkit";
import {getPreference, localStorageKeys, sessionStorageKeys} from "@/api/preferences";
import {buildFulfillmentsList, buildOrdersAges, defaultOrdersSorter} from "./utils";
import {fulfillAllOrders, loadOrders} from "./actions";
import {fulfillOrder, importOrder, linkOrder, loadOrder} from "../current-order/actions";
import dayjs from "dayjs";

export interface OrdersState {
    list: ExtendedSavedOrder[];
    loading: boolean;
    status: FilterOrderStatus;
    created_at_min: string | null;
    created_at_max: string | null;
    page: number;
    rowsPerPage: number;
    sort: SortProps<ExtendedSavedOrder>;
    fulfillments: FulfillmentList;
    errors: FulfillmentErrorList;
    ages: OrdersAgeList;
    importing: string | number | null;
}

export const initialOrdersState = (): OrdersState => ({
    list: [],
    loading: false,
    status: 'open',
    created_at_min: getPreference(sessionStorageKeys.fromDate, dayjs(new Date()).subtract(14, 'days').toISOString()),
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
                    ...state.list.filter(row => row.id === action.meta.arg?.id)
                        .map(row => ({...row, import_status: 'pending'}))
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
