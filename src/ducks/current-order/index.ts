import {ExtendedSavedOrder} from "chums-types";
import {fulfillOrder, importOrder, linkOrder, loadOrder, loadRiskSummary,} from "./actions";
import {createReducer} from "@reduxjs/toolkit";
import {loadOrders} from "../orders/actions";
import {ShopifyOrderRow} from "../types";

export interface CurrentOrderState {
    order: ShopifyOrderRow | null;
    loading: boolean;
    saving: boolean;
}


export const initialCurrentOrderState: CurrentOrderState = {
    order: null,
    loading: false,
    saving: false,
}

const currentOrderReducer = createReducer(initialCurrentOrderState, (builder) => {
    builder
        .addCase(loadOrders.fulfilled, (state, action) => {
            if (state.order) {
                const [current] = action.payload.filter(row => Number(row.id) === Number(state.order!.id));
                state.order = current ?? null;
            }
        })
        .addCase(importOrder.fulfilled, (state, action) => {
            if (state.order && Number(state.order.id) === Number(action.meta.arg.id)) {
                state.order = action.payload;
            }
        })
        .addCase(linkOrder.pending, (state) => {
            state.saving = true;
        })
        .addCase(linkOrder.fulfilled, (state, action) => {
            state.order = action.payload;
            state.saving = false;
        })
        .addCase(linkOrder.rejected, (state) => {
            state.saving = false;
        })
        .addCase(loadOrder.pending, (state, action) => {
            state.loading = true;
            state.order = action.meta.arg ?? null;
        })
        .addCase(loadOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        })
        .addCase(loadOrder.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadRiskSummary.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadRiskSummary.fulfilled, (state, action) => {
            state.loading = false;
            if (state.order && state.order.shopify_order) {
                state.order.shopify_order.risk = action.payload;
            }
        })
        .addCase(loadRiskSummary.rejected, (state) => {
            state.loading = false;
        })
        .addCase(fulfillOrder.pending, (state, action) => {
            state.saving = true;
            if (state.order && state.order.shopify_order && Number(state.order.id) === Number(action.meta.arg)) {
                state.order.shopify_order.fulfillment_status = 'sending';
            }
        })
        .addCase(fulfillOrder.fulfilled, (state, action) => {
            state.saving = false;
            if (state.order && state.order.shopify_order && Number(state.order.id) === Number(action.meta.arg)) {
                state.order.shopify_order.fulfillment_status = 'fulfilled';
            }
        })
        .addCase(fulfillOrder.rejected, (state, action) => {
            state.saving = false;
            if (state.order && state.order.shopify_order && Number(state.order.id) === Number(action.meta.arg)) {
                state.order.shopify_order.fulfillment_status = !!state.order.InvoiceNo ? 'invoiced' : 'open';
            }
        })
})

export default currentOrderReducer;
