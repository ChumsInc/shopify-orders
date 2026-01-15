import type {Fulfillment, ShopifyOrder} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";
import type {FetchOrdersOptions, LinkSalesOrderOptions, ShopifyOrderRow, TriggerImportOptions} from "../ducks/types";
import type {OrderRiskSummary} from "chums-types/shopify";

export const dateString = (date: string | null): string => {
    if (!date) {
        return '';
    }
    const d = new Date(date);
    if (!d.valueOf()) {
        return '';
    }
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

export async function fetchOrder(arg: number | string): Promise<ShopifyOrderRow | null> {
    try {
        const url = `/api/shopify/orders/fetch/${encodeURIComponent(arg)}`
        const res = await fetchJSON<{ order: ShopifyOrderRow }>(url, {cache: "no-cache"});
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

export async function fetchOrders(arg: FetchOrdersOptions): Promise<ShopifyOrderRow[]> {
    try {
        const options = new URLSearchParams();
        if (arg.status !== 'open' && !arg.created_at_min) {
            return Promise.reject(new Error('Missing parameters for created_at_min'));
        }
        options.set('status', arg.status);
        if (arg.status !== 'open' && arg.created_at_min) {
            options.set('created_at_min', dateString(arg.created_at_min));
        }
        if (arg.status !== 'open' && arg.created_at_max) {
            options.set('created_at_max', dateString(arg.created_at_max));
        }
        const url = `/api/shopify/orders/fetch?${options.toString()}`;
        const res = await fetchJSON<{ orders: ShopifyOrderRow[] }>(url, {cache: 'no-cache'});
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

export async function retryImportOrder(arg: TriggerImportOptions): Promise<ShopifyOrderRow | null> {
    try {
        const url = `/api/shopify/orders/import/${encodeURIComponent(arg.id)}`;
        const res = await fetchJSON<{ order: ShopifyOrder }>(url, {cache: 'no-cache', method: 'POST'})
        if (!res?.order) {
            return null;
        }
        return await fetchOrder(res.order.id);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchImportOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchImportOrder()", err);
        return Promise.reject(new Error('Error in fetchImportOrder()'));
    }
}

export async function postLinkSalesOrder(arg: LinkSalesOrderOptions): Promise<ShopifyOrderRow | null> {
    try {
        const url = `/api/shopify/orders/${encodeURIComponent(arg.id)}/link/${encodeURIComponent(arg.salesOrderNo)}`;
        const res = await fetchJSON<{ order: ShopifyOrderRow }>(url, {cache: 'no-cache', method: 'POST'})
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

export async function postFulfillOrder(arg: number | string): Promise<Fulfillment | null> {
    try {
        const url = `/api/shopify/fulfillment-orders/${encodeURIComponent(arg)}/fulfill`;
        const res = await fetchJSON<{ fulfillment: Fulfillment }>(url, {method: 'POST'});
        return res?.fulfillment ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postFulfillOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("postFulfillOrder()", err);
        return Promise.reject(new Error('Error in postFulfillOrder()'));
    }
}

export async function fetchRiskSummary(arg: string): Promise<OrderRiskSummary | null> {
    try {
        const url = `/api/shopify/graphql/orders/${encodeURIComponent(arg)}/risk.json`;
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
