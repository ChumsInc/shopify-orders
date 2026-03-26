import type {ExtendedSavedOrder} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";
import type {
    CreatedFulfillmentResponse,
    LinkSalesOrderOptions,
    SageImportError,
    SageImportResponseV2,
    TriggerImportOptions
} from "../ducks/types";
import type {OrderRiskSummary} from "chums-types/shopify-graphql";
import {allowErrorResponseHandler} from "@chumsinc/ui-utils/src/fetch.ts";
import {isSageImportResponse} from "@/utils/utils.ts";

export async function fetchOrder(arg: number | string): Promise<ExtendedSavedOrder | null> {
    try {
        const url = `/api/shopify/graphql/query/orders/${encodeURIComponent(arg)}.json`
        const res = await fetchJSON<{ order: ExtendedSavedOrder }>(url, {cache: "no-cache"});
        return res?.order ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOrder()", err);
        return Promise.reject(new Error('Error in fetchOrder()'));
    }
}

export async function fetchOrders(): Promise<ExtendedSavedOrder[]> {
    try {
        const url = `/api/shopify/graphql/query/orders.json?status=open`;
        const res = await fetchJSON<{ orders: ExtendedSavedOrder[] }>(url, {cache: 'no-cache'});
        return res?.orders ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOrders()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOrders()", err);
        return Promise.reject(new Error('Error in fetchOrders()'));
    }
}

export async function retryImportOrder(arg: TriggerImportOptions): Promise<ExtendedSavedOrder | null> {
    try {
        const url = `/api/shopify/graphql/orders/${encodeURIComponent(arg.id)}/import.json?retry=true`;
        const res = await fetchJSON<SageImportResponseV2 | SageImportError>(url, {cache: 'no-cache', method: 'POST'})
        if (res && isSageImportResponse(res)) {
            return res.order;
        }
        return null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchImportOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchImportOrder()", err);
        return Promise.reject(new Error('Error in fetchImportOrder()'));
    }
}

export async function postLinkSalesOrder(arg: LinkSalesOrderOptions): Promise<ExtendedSavedOrder | null> {
    try {
        const url = `/api/shopify/orders/:id/link/:salesOrderNo.json`
            .replace(':id', encodeURIComponent(arg.id))
            .replace(':salesOrderNo', encodeURIComponent(arg.salesOrderNo));
        const res = await fetchJSON<{ order: ExtendedSavedOrder }>(url, {cache: 'no-cache', method: 'POST'})
        return res?.order ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postLinkSalesOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("postLinkSalesOrder()", err);
        return Promise.reject(new Error('Error in postLinkSalesOrder()'));
    }
}

export async function postFulfillOrder(arg: number | string): Promise<CreatedFulfillmentResponse | null> {
    try {
        const url = `/api/shopify/graphql/mutate/orders/${encodeURIComponent(arg)}/fulfill.json`;
        const res = await fetchJSON<CreatedFulfillmentResponse>(url, {method: 'POST'}, allowErrorResponseHandler);
        return res ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postFulfillOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("postFulfillOrder()", err);
        return Promise.reject(new Error('Error in postFulfillOrder()'));
    }
}

export async function fetchRiskSummary(arg: number | string): Promise<OrderRiskSummary | null> {
    try {
        const url = `/api/shopify/graphql/query/orders/${encodeURIComponent(arg)}/risk.json`;
        const res = await fetchJSON<{ riskSummary: OrderRiskSummary }>(url, {cache: 'no-cache'});
        return res?.riskSummary ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchRiskSummary()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchRiskSummary()", err);
        return Promise.reject(new Error('Error in fetchRiskSummary()'));
    }
}
