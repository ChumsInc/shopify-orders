import {createAsyncThunk} from "@reduxjs/toolkit";
import type {Fulfillment} from "chums-types";
import type {LinkSalesOrderOptions, ShopifyOrderRow, TriggerImportOptions} from "../types";
import {fetchOrder, fetchRiskSummary, postFulfillOrder, postLinkSalesOrder, retryImportOrder} from "../../api";
import type {RootState} from "@/app/configureStore";
import {selectImporting, selectOrderFulfillment} from "../orders/selectors";
import type {OrderRiskSummary} from "chums-types/shopify";
import {selectCurrentOrderStatus} from "@/ducks/current-order/index.ts";

export const importOrder = createAsyncThunk<ShopifyOrderRow | null, TriggerImportOptions>(
    'orders/import',
    async (arg,) => {
        return await retryImportOrder(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectImporting(state) && selectCurrentOrderStatus(state) === 'idle';
        }
    }
);


export const loadOrder = createAsyncThunk<ShopifyOrderRow | null, ShopifyOrderRow | undefined>(
    'currentOrder/load',
    async (arg) => {
        if (!arg) {
            return null;
        }
        return await fetchOrder(arg.id);
    }, {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentOrderStatus(state) === 'idle'
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
            return !!arg.id
                && !!arg.salesOrderNo
                && selectCurrentOrderStatus(state) === 'idle'
        }
    }
)

export const loadRiskSummary = createAsyncThunk<OrderRiskSummary | null, string>(
    'currentOrder/loadRiskSummary',
    async (arg) => {
        return await fetchRiskSummary(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentOrderStatus(state) === 'idle'
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
