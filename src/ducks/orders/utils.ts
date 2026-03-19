import type {FulfillmentList, OrdersAgeList, ShopifyOrderRow} from "../types";
import type {SortProps} from "chums-types";
import type {ShopifyAddress} from "chums-types/shopify";
import {businessDayjs} from "@/utils/date-utils.ts";

export const orderSorter = (sort: SortProps<ShopifyOrderRow>) =>
    (a: ShopifyOrderRow, b: ShopifyOrderRow) => {
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
                return (a.graphqlOrder?.customer?.displayName ?? '').localeCompare(b.graphqlOrder?.customer?.displayName ?? '') * sortMod;
            case 'paymentGatewayNames':
                return (a.graphqlOrder?.paymentGatewayNames?.join(', ') ?? '').localeCompare(b.graphqlOrder?.paymentGatewayNames?.join(', ') ?? '') === 0
                    ? a.id > b.id ? 1 : -1
                    : (a.graphqlOrder?.paymentGatewayNames?.join(', ') ?? '').localeCompare(b.graphqlOrder?.paymentGatewayNames?.join(', ') ?? '') * sortMod;
            case 'createdAt':
            case 'closedAt':
                return (
                    (a.graphqlOrder?.[field] ?? '').localeCompare(b.graphqlOrder?.[field] ?? '') === 0
                        ? (a.id > b.id ? 1 : -1)
                        : (a.graphqlOrder?.[field] ?? '').localeCompare(b.graphqlOrder?.[field] ?? '')
                ) * sortMod;
            case 'shippingAddress': {
                const aVal = [a.graphqlOrder?.shippingAddress?.city ?? '', a.graphqlOrder?.shippingAddress?.provinceCode ?? '', a.graphqlOrder?.shippingAddress?.zip ?? ''].join(' ').toLowerCase();
                const bVal = [b.graphqlOrder?.shippingAddress?.city ?? '', b.graphqlOrder?.shippingAddress?.provinceCode ?? '', b.graphqlOrder?.shippingAddress?.zip ?? ''].join(' ').toLowerCase();
                return (aVal.localeCompare(bVal) === 0
                    ? (a.id > b.id ? 1 : -1)
                    : aVal.localeCompare(bVal)) * sortMod;
            }
            case 'currentTotalPriceSet':
                const aVal = Number(a.graphqlOrder?.currentTotalPriceSet?.shopMoney?.amount ?? 0)
                const bVal = Number(b.graphqlOrder?.currentTotalPriceSet?.shopMoney?.amount ?? 0)
                return (aVal === bVal
                    ? (a.id > b.id ? 1 : -1)
                    : (aVal > bVal ? 1 : -1)) * sortMod;

            default:
                return (a.id > b.id ? 1 : -1) * sortMod;
        }
    }


export const formatAddress = (address?: ShopifyAddress): string | null => {
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


export const defaultOrdersSorter = (a: ShopifyOrderRow, b: ShopifyOrderRow) => {
    return a.sage_SalesOrderNo > b.sage_SalesOrderNo ? 1 : -1;
}

export const buildFulfillmentsList = (orders: ShopifyOrderRow[]): FulfillmentList => {
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

export const buildOrdersAges = (orders: ShopifyOrderRow[]): OrdersAgeList => {
    const list: OrdersAgeList = {};
    const today = new Date();
    orders.forEach(order => {
        const daysOld: number = businessDayjs(order.graphqlOrder?.createdAt ?? today)
            .businessDaysDiff(businessDayjs(order.graphqlOrder?.closedAt ?? today));
        if (list[daysOld] === undefined) {
            list[daysOld] = 0;
        }
        list[daysOld] += 1;
    })
    return list;
}

