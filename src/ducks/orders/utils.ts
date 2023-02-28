import {FulfillmentList, OrdersAgeList, ShopifyOrdersTable} from "../types";
import {ExtendedSavedOrder, SortProps} from "chums-types";
import {ShopifyAddress} from "chums-types/src/shopify/shopify-orders";
import differenceInBusinessDays from "date-fns/differenceInBusinessDays";

export const orderSorter = (sort: SortProps<ShopifyOrdersTable>) =>
    (a: ExtendedSavedOrder, b: ExtendedSavedOrder) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
        case 'sage_SalesOrderNo':
        case 'InvoiceNo':
        case 'ShipVia':
        case 'import_status':
        case 'OrderStatus':
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? (a.id > b.id ? 1 : -1)
                    : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'customer':
        {
            const aVal = [a.shopify_order?.customer.first_name ?? '', a.shopify_order?.customer.last_name ?? ''].join(' ').toLowerCase();
            const bVal = [b.shopify_order?.customer.first_name ?? '', b.shopify_order?.customer.last_name ?? ''].join(' ').toLowerCase();
            return  (aVal === bVal
                ? (a.id > b.id ? 1 : -1)
                : (aVal > bVal ? 1 : -1)) * sortMod;
        }
        case 'gateway':
        case 'created_at':
            return (
                (a.shopify_order![field] ?? '') === (b.shopify_order![field] ?? '')
                    ? (a.id > b.id ? 1 : -1)
                    : ((a.shopify_order![field] ?? '').toLowerCase() > (b.shopify_order![field] ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'shipping_address': {
            const aVal = [a.shopify_order!.shipping_address.city ?? '', a.shopify_order!.shipping_address.province_code ?? '', a.shopify_order!.shipping_address.zip].join(' ').toLowerCase();
            const bVal = [b.shopify_order!.shipping_address.city ?? '', b.shopify_order!.shipping_address.province_code ?? '', b.shopify_order!.shipping_address.zip].join(' ').toLowerCase();
            return  (aVal === bVal
                ? (a.id > b.id ? 1 : -1)
                : (aVal > bVal ? 1 : -1)) * sortMod;
        }
        case 'total_price_usd':
            const aVal = Number(a.shopify_order?.total_price_usd ?? 0)
            const bVal = Number(b.shopify_order?.total_price_usd ?? 0)
            return  (aVal === bVal
                ? (a.id > b.id ? 1 : -1)
                : (aVal > bVal ? 1 : -1)) * sortMod;

        default:
            return  (a.id > b.id ? 1 : -1) * sortMod;
        }
    }


export const formatAddress = (address?:ShopifyAddress):string|null => {
    if (!address) {
        return null;
    }
    return [
        address.city,
        address.province_code,
        address.zip,
        address.country_code === 'US' ? null : address.country_code
    ].filter(val => val !== null).join(' ');
};


export const defaultOrdersSorter = (a: ExtendedSavedOrder, b: ExtendedSavedOrder) => {
    return a.sage_SalesOrderNo > b.sage_SalesOrderNo ? 1 : -1;
}

export const buildFulfillmentsList = (orders: ExtendedSavedOrder[]): FulfillmentList => {
    const list: FulfillmentList = {};
    orders.forEach(order => {
        list[order.id] = 'open';
        if (!!order.InvoiceNo && order.shopify_order?.fulfillment_status === null) {
            list[order.id] = 'invoiced';
        } else if (!!order.InvoiceNo && order.shopify_order?.fulfillment_status === 'partial') {
            list[order.id] = 'partial';
        } else if (!!order.InvoiceNo && order.shopify_order?.fulfillment_status === 'fulfilled') {
            list[order.id] = 'fulfilled';
        }
    });
    return list;
}

export const buildOrdersAges = (orders: ExtendedSavedOrder[]): OrdersAgeList => {
    const list: OrdersAgeList = {};
    const today = new Date();
    orders.forEach(order => {
        const daysOld: number = differenceInBusinessDays(new Date(order.shopify_order?.closed_at ?? today), new Date(order.shopify_order?.created_at ?? today));
        if (list[daysOld] === undefined) {
            list[daysOld] = 0;
        }
        list[daysOld] += 1;
    })
    return list;
}
