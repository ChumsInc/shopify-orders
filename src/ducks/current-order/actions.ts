import {createAsyncThunk} from "@reduxjs/toolkit";
import {ExtendedSavedOrder, Fulfillment, ShopifyRisk} from "chums-types";
import {LinkSalesOrderOptions, ShopifyOrderRow, TriggerImportOptions} from "../types";
import {fetchOrder, fetchRiskSummary, postFulfillOrder, postLinkSalesOrder, retryImportOrder} from "../../api";
import {RootState} from "../../app/configureStore";
import {selectSaving} from "./selectors";
import {selectImporting, selectLoading, selectOrderFulfillment} from "../orders/selectors";
import {OrderRiskSummary} from "chums-types/src/shopify";

export const importOrder = createAsyncThunk<ShopifyOrderRow|null, TriggerImportOptions>(
    'orders/import',
    async (arg, ) => {
        return await retryImportOrder(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectImporting(state);
        }
    }
);


export const loadOrder = createAsyncThunk<ShopifyOrderRow | null, ShopifyOrderRow|undefined>(
    'currentOrder/load',
    async (arg) => {
        if (!arg) {
            return null;
        }
        return await fetchOrder(arg.id);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const isLoading = selectLoading(state);
            const isSaving = selectSaving(state);
            return !(isLoading || isSaving);
        }
    }
)

export const linkOrder = createAsyncThunk<ShopifyOrderRow | null, LinkSalesOrderOptions>(
    'currentOrder/link',
    async (arg) => {
        return await postLinkSalesOrder(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && !!arg.salesOrderNo && !(selectSaving(state) || selectLoading(state));
        }
    }
)

export const loadRiskSummary = createAsyncThunk<OrderRiskSummary|null, string>(
    'currentOrder/loadRiskSummary',
    async (arg) => {
        return await fetchRiskSummary(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !(selectSaving(state) || selectLoading(state));
        }
    }
)



export const fulfillOrder = createAsyncThunk<Fulfillment | null, string | number>(
    'currentOrder/fulfillOrder',
    async (arg) => {
        return await postFulfillOrder(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const fulfillment = selectOrderFulfillment(state, arg);
            return fulfillment === 'invoiced' || fulfillment === 'pending';
        }
    }
)
