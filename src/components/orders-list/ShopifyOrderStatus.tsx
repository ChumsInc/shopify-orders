import {now} from "@/utils/utils.ts";
import type {ShopifyOrder} from "chums-types";
import classNames from "classnames";
import type {Variant} from "react-bootstrap/esm/types";
import Badge from "react-bootstrap/Badge";
import {businessDayjs} from "@/utils/date-utils.ts";
import dayjs from "dayjs";

const paymentBadgeType = (st: string | null): Variant => {
    switch (st) {
        case 'open':
            return 'info';
        case 'authorized':
        case 'partial':
            return 'warning';
        case 'paid':
        case 'fulfilled':
        case 'sending':
        case 'complete':
            return 'success';
        case 'invoiced':
        case 'pending':
            return 'primary';
        default:
            return 'danger';
    }
}

const daysType = (days: number): Variant => {
    if (days > 4) {
        return 'danger';
    } else if (days > 2) {
        return 'warning';
    }
    return 'light';
};

const gwBadgeName = (gateway: string): string => {
    switch (gateway) {
        case 'paypal':
            return 'PayPal';
        case 'shopify_payments':
            return 'SP';
        default:
            return gateway;
    }
};

const GatewayBadge = ({gateway}: { gateway: string }) => {
    return (
        <Badge bg="secondary">{gwBadgeName(gateway)}</Badge>
    )
};

// const PaymentBadge = ({financial_status}: { financial_status: string | null }) => {
//     if (!financial_status || financial_status !== 'paid') {
//         return null;
//     }
//     return (
//         <Badge color={paymentBadgeType(financial_status)}>{financial_status}</Badge>
//     )
// };

const FulfillmentBadge = ({fulfillment_status}: { fulfillment_status: string | null }) => {
    if (fulfillment_status === 'open' || fulfillment_status === 'invoiced') {
        return null;
    }
    return (
        <Badge color={paymentBadgeType(fulfillment_status)}>{fulfillment_status}</Badge>
    )
};

const ShopifyOrderStatus = ({order}: { order: ShopifyOrder | null }) => {
    if (!order) {
        return null;
    }
    const {
        fulfillment_status,
        total_discounts,
        risks = [],
    } = order;
    const days = businessDayjs(order.processed_at ?? now()).businessDaysDiff(businessDayjs(order.closed_at ?? now()))
    const tagList = order?.tags?.split(',') ?? [];
    const hasDiscount = Number(total_discounts) > 0;
    const [risk] = risks?.filter(risk => Number(risk.score) > 0);
    return (
        <div style={{fontSize: '0.75rem'}} className="d-flex flex-wrap justify-content-start gap-1">
            <GatewayBadge gateway={order.payment_gateway_names.join(',')}/>
            {!!risk && (
                <Badge bg="danger">
                    {risk.merchant_message}: {risk.recommendation}
                </Badge>
            )}
            {(days > 1 || !!order.closed_at) && (
                <Badge bg={daysType(days)} className={classNames({'text-dark': days < 3})}>
                    <span className="me-1">days:</span>{days}
                </Badge>
            )}
            {/*<PaymentBadge financial_status={financial_status}/>*/}
            <FulfillmentBadge fulfillment_status={fulfillment_status}/>

            {tagList.map(tag => (
                <Badge key={tag} bg="info" text="dark">{tag}</Badge>
            ))}
            {hasDiscount && (<Badge bg="primary">disc</Badge>)}
            {!!order.cancelled_at && (
                <Badge bg="warning">Cancelled: {dayjs(order.cancelled_at).format('MM/DD/YYYY')}</Badge>)}
        </div>
    );
}

export default ShopifyOrderStatus;
