import type {RootState} from "@/app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {orderSorter} from "./utils";

export const selectList = (state: RootState) => state.orders.list;
export const selectLoading = (state: RootState) => state.orders.loading;
export const selectFilterStatus = (state: RootState) => state.orders.status;
export const selectCreatedAtMin = (state: RootState) => state.orders.created_at_min;
export const selectCreatedAtMax = (state: RootState) => state.orders.created_at_max;
export const selectPage = (state: RootState) => state.orders.page;
export const selectRowsPerPage = (state: RootState) => state.orders.rowsPerPage;
export const selectSort = (state: RootState) => state.orders.sort;
export const selectFulfillmentsList = (state: RootState) => state.orders.fulfillments;
export const selectFulfillmentsErrors = (state:RootState) => state.orders.errors;
export const selectOrderFulfillment = (state:RootState, id: number|string) => {
    return state.orders.fulfillments[Number(id)] ?? null;
}
export const selectFetchOptions = createSelector(
    [selectFilterStatus, selectCreatedAtMin, selectCreatedAtMax],
    (status, created_at_min, created_at_max) => {
        return {status, created_at_min, created_at_max}
    }
)
export const selectSortedList = createSelector(
    [selectList, selectSort, selectFulfillmentsList],
    (list, sort, fulfillments) => {
        return list.map(row => {
            return {
                ...row,
                shopify_order: row.shopify_order
                    ? {...row.shopify_order, fulfillment_status: fulfillments[row.id] ?? row.shopify_order.fulfillment_status}
                    : row.shopify_order
            }
        }).sort(orderSorter(sort));
    }
)
export const selectImporting = (state:RootState) => state.orders.importing;
export const selectNextPendingFulfillment = (state:RootState) => {
    const keys = Object.keys(state.orders.fulfillments);
    return keys.filter(key => state.orders.fulfillments[key] === 'pending');
}

export const selectOrderAges = (state:RootState) => state.orders.ages;
