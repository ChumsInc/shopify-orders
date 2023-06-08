import {ExtendedSavedOrder, Fulfillment, ShopifyOrder, ShopifyRisk} from "chums-types";
import {fetchJSON} from "chums-components";
import {FetchOrdersOptions, LinkSalesOrderOptions, TriggerImportOptions} from "../ducks/types";

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

export async function fetchOrder(arg: number | string): Promise<ExtendedSavedOrder | null> {
    try {
        const url = `/api/shopify/orders/fetch/${encodeURIComponent(arg)}`
        const {order} = await fetchJSON<{ order: ExtendedSavedOrder }>(url, {cache: "no-cache"});
        return order ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOrder()", err);
        return Promise.reject(new Error('Error in fetchOrder()'));
    }
}

export async function fetchOrders(arg: FetchOrdersOptions): Promise<ExtendedSavedOrder[]> {
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
        const {orders} = await fetchJSON<{ orders: ExtendedSavedOrder[] }>(url, {cache: 'no-cache'});
        return orders ?? [];
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
        const url = `/api/shopify/orders/import/${encodeURIComponent(arg.id)}`;
        const {order} = await fetchJSON<{ order: ShopifyOrder }>(url, {cache: 'no-cache', method: 'POST'})
        if (!order) {
            return null;
        }
        return await fetchOrder(order.id);
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
        const url = `/api/shopify/orders/${encodeURIComponent(arg.id)}/link/${encodeURIComponent(arg.salesOrderNo)}`;
        const {order} = await fetchJSON<{ order: ExtendedSavedOrder }>(url, {cache: 'no-cache', method: 'POST'})
        return order ?? null;
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
        const {fulfillment} = await fetchJSON<{ fulfillment: Fulfillment }>(url, {method: 'POST'});
        return fulfillment ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postFulfillOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("postFulfillOrder()", err);
        return Promise.reject(new Error('Error in postFulfillOrder()'));
    }
}

export async function fetchRisks(arg: number | string): Promise<ShopifyRisk[]> {
    try {
        const url = `/api/shopify/orders/risk/${encodeURIComponent(arg)}`;
        const {risks} = await fetchJSON<{ risks: ShopifyRisk[] }>(url, {cache: 'no-cache'});
        return risks ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchRisks()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchRisks()", err);
        return Promise.reject(new Error('Error in fetchRisks()'));
    }
}
