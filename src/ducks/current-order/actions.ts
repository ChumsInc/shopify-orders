import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ExtendedSavedOrder} from "chums-types";
import type {CreatedFulfillmentResponse, LinkSalesOrderOptions, TriggerImportOptions} from "../types";
import {fetchOrder, fetchRiskSummary, postFulfillOrder, postLinkSalesOrder, retryImportOrder} from "../../api";
import type {RootState} from "@/app/configureStore";
import type {OrderRiskSummary} from "chums-types/shopify-graphql";
import {selectCurrentOrderStatus} from "@/ducks/current-order/index.ts";
import {selectFulfillmentById} from "@/ducks/orders/fulfillmentStatusSlice.ts";

export const importOrder = createAsyncThunk<ExtendedSavedOrder | null, TriggerImportOptions>(
    'orders/import',
    async (arg,) => {
        return await retryImportOrder(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentOrderStatus(state) === 'idle';
        }
    }
);


export const loadOrder = createAsyncThunk<ExtendedSavedOrder | null, ExtendedSavedOrder | undefined>(
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

export const linkOrder = createAsyncThunk<ExtendedSavedOrder | null, LinkSalesOrderOptions>(
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

export const loadRiskSummary = createAsyncThunk<OrderRiskSummary | null, string | number>(
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


export const fulfillOrder = createAsyncThunk<CreatedFulfillmentResponse | null, string | number>(
    'currentOrder/fulfillOrder',
    async (arg) => {
        return await postFulfillOrder(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const fulfillment = selectFulfillmentById(state, `${arg}`);
            return fulfillment.status !== 'PENDING_FULFILLMENT' && fulfillment.status !== 'IN_PROGRESS'
        }
    }
)
