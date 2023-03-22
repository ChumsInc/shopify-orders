import {ExtendedSavedOrder, ShopifyOrder, SortProps} from "chums-types";
import {ShopifyAddress, ShopifyCustomer} from "chums-types/src/shopify/shopify-orders";

export type FilterOrderStatus = 'open' | 'closed' | 'cancelled' | 'any';
export type FulfillmentStatus = 'open' | 'invoiced' | 'pending' | 'sending' | 'fulfilled' | 'error'|'partial';

export interface FulfillmentList {
    [key: number | string]: FulfillmentStatus;
}
export interface FulfillmentErrorList {
    [key:number|string]: string;
}

export interface OrdersAgeList {
    [key: number]: number
}

export interface FetchOrdersOptions {
    status: FilterOrderStatus;
    created_at_min?: string | null;
    created_at_max?: string | null;
}

export interface TriggerImportOptions {
    id: number | string;
    retry: boolean;
}

export interface LinkSalesOrderOptions {
    id: string | number;
    salesOrderNo: string;
}

export type NestedKeyOf<T = object> =
    {
        [Key in keyof T & (string | number)]: T[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
        : `${Key}`
    }[keyof T & (string | number)];

export interface NestedSortProps<T = object> extends SortProps {
    field: NestedKeyOf<T>;
}

export type ShopifyOrdersTable =
    Pick<ExtendedSavedOrder, 'sage_SalesOrderNo' | 'OrderStatus' | 'InvoiceNo' | 'CancelReasonCode' | 'ShipVia' | 'import_status' | 'shopify_order'>
    & Pick<ShopifyOrder, 'id' | 'created_at' | 'shipping_lines' | 'total_price_usd' | 'fulfillment_status' | 'gateway' | 'tags' | 'financial_status' | 'risks' | 'processed_at' | 'closed_at' | 'cancelled_at' | 'total_discounts' | 'customer' | 'shipping_address'>
    & Pick<ShopifyAddress, 'city' | 'province_code' | 'zip' | 'country_code'>
    & Pick<ShopifyCustomer, 'first_name' | 'last_name'>
