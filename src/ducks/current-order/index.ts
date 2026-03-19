import {fulfillOrder, importOrder, linkOrder, loadOrder, loadRiskSummary,} from "./actions";
import {createSlice} from "@reduxjs/toolkit";
import {loadOrders} from "../orders/actions";
import {dismissAlert} from "@/ducks/alerts";
import type {ExtendedSavedOrder} from "chums-types/shopify";
import type {OrderDisplayFulfillmentStatus} from "chums-types/shopify-graphql";

export interface CurrentOrderState {
    order: ExtendedSavedOrder | null;
    status: 'idle' | 'loading' | 'importing' | 'saving' | 'fulfilling' | 'rejected';
}


export const initialCurrentOrderState: CurrentOrderState = {
    order: null,
    status: 'idle',
}

const currentOrderSlice = createSlice({
    name: 'currentOrder',
    initialState: initialCurrentOrderState,
    reducers: {
        dismissOrder: (state) => {
            state.order = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadOrders.fulfilled, (state, action) => {
                state.status = 'idle';
                if (state.order) {
                    const current = action.payload.find(row => Number(row.id) === Number(state.order!.id));
                    state.order = current ?? null;
                }
            })
            .addCase(importOrder.pending, (state) => {
                state.status = 'importing';
            })
            .addCase(importOrder.fulfilled, (state, action) => {
                state.status = 'idle';
                if (state.order && Number(state.order.id) === Number(action.meta.arg.id)) {
                    state.order = action.payload;
                }
            })
            .addCase(linkOrder.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(linkOrder.fulfilled, (state, action) => {
                state.order = action.payload;
                state.status = 'idle';
            })
            .addCase(linkOrder.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(loadOrder.pending, (state, action) => {
                state.status = 'loading';
                state.order = action.meta.arg ?? null;
            })
            .addCase(loadOrder.fulfilled, (state, action) => {
                state.status = 'idle';
                state.order = action.payload;
            })
            .addCase(loadOrder.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(loadRiskSummary.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadRiskSummary.fulfilled, (state, action) => {
                state.status = 'idle';
                if (state.order && state.order.graphqlOrder && action.payload) {
                    state.order.graphqlOrder.risk = action.payload;
                }
            })
            .addCase(loadRiskSummary.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(fulfillOrder.pending, (state, action) => {
                state.status = 'fulfilling';
                if (state.order && state.order.graphqlOrder && Number(state.order.id) === Number(action.meta.arg)) {
                    state.order.graphqlOrder.displayFulfillmentStatus = 'PENDING_FULFILLMENT' as OrderDisplayFulfillmentStatus.PendingFulfillment;
                }
            })
            .addCase(fulfillOrder.fulfilled, (state, action) => {
                state.status = 'idle';
                if (state.order && state.order.graphqlOrder && Number(state.order.id) === Number(action.meta.arg)) {
                    state.order.graphqlOrder.displayFulfillmentStatus = 'FULFILLED' as OrderDisplayFulfillmentStatus.Fulfilled;
                }
            })
            .addCase(fulfillOrder.rejected, (state, action) => {
                state.status = 'rejected';
                if (state.order && state.order.graphqlOrder && Number(state.order.id) === Number(action.meta.arg)) {
                    state.order.graphqlOrder.displayFulfillmentStatus = 'REQUEST_DECLINED' as OrderDisplayFulfillmentStatus.RequestDeclined;
                }
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('currentOrder/')) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectCurrentOrder: (state) => state.order,
        selectCurrentOrderStatus: (state) => state.status,
    }
})

export default currentOrderSlice;
export const {dismissOrder} = currentOrderSlice.actions;
export const {selectCurrentOrder, selectCurrentOrderStatus} = currentOrderSlice.selectors;
