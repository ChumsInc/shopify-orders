import type {ExtendedSavedOrder} from "chums-types";
import type {SavedOrder} from "chums-types/shopify";
import type {MailingAddress, Order} from "chums-types/shopify-graphql";
import type {ErrorObject} from "serialize-error";


export type FilterOrderStatus = 'open' | 'closed' | 'cancelled' | 'any';
export type FulfillmentStatus = 'open' | 'invoiced' | 'pending' | 'sending' | 'fulfilled' | 'error' | 'partial';

export interface FulfillmentList {
    [key: number | string]: FulfillmentStatus;
}

export interface FulfillmentErrorList {
    [key: number | string]: string;
}

export type OrdersAgeList = Record<number, number>;

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

export type ShopifyOrderRow =
    ExtendedSavedOrder
    & Pick<ExtendedSavedOrder, 'id' | 'gid' | 'sage_SalesOrderNo' | 'OrderStatus' | 'InvoiceNo' | 'CancelReasonCode'
        | 'ShipVia' | 'import_status' | 'graphqlOrder'>
    & Partial<Pick<Order, 'legacyResourceId' | 'createdAt' | 'shippingLines' | 'totalPriceSet' | 'paymentGatewayNames'
    | 'tags' | 'displayFinancialStatus' | 'risks' | 'processedAt' | 'closedAt' | 'cancellation'
    | 'totalDiscountsSet' | 'customer' | 'shippingAddress' | 'displayFulfillmentStatus'| 'currentTotalPriceSet'>>
    & Partial<Pick<MailingAddress, 'name' | 'city' | 'provinceCode' | 'zip' | 'countryCodeV2'>>
    & Partial<Pick<SavedOrder, 'import_result'>>

export interface CreatedFulfillment {
    id: string;
    legacyResourceId: string;
    status: string;
    createdAt: string;
    order: {
        id: string;
        legacyResourceId: string;
    };
    trackingInfo: {
        company: string;
        number: string;
        url: string;
    }[]
}

export interface CreatedFulfillmentResponse {
    fulfillment: CreatedFulfillment|null;
    error: ErrorObject|null;
}

export interface SageImportResponseV2 {
    order: ExtendedSavedOrder;
    success: boolean;
    salesOrderNo: string;
    lineResponse: string[];
    import_status: string;
    validation: string[]
}
export interface SageImportError {
    error: string;
    salesOrderNo?: string;
}
