import React, {Fragment} from 'react';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';
import {now} from "../../utils";
import {ShopifyOrder} from "chums-types";
import {Badge, BootstrapBGColor} from "chums-components";
import classNames from "classnames";

const paymentBadgeType = (st: string | null): BootstrapBGColor => {
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

const daysType = (days: number): BootstrapBGColor => {
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
        <Badge color="dark" text={gwBadgeName(gateway)}/>
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
        // financial_status,
        gateway,
        tags,
        fulfillment_status,
        processed_at,
        total_discounts,
        risks = [],
        closed_at,
        cancelled_at
    } = order;
    const days = differenceInBusinessDays(new Date(closed_at || now()), new Date(processed_at));
    const tagList = order?.tags?.split(',') ?? [];
    const hasDiscount = Number(total_discounts) > 0;
    // const hasRisk = risks?.filter(risk => Number(risk.score) > 0).length > 0;
    const [risk] = risks?.filter(risk => Number(risk.score) > 0);
    return (
        <Fragment>
            <GatewayBadge gateway={gateway}/>
            {!!risk && (
                <Badge color="danger">
                    {risk.merchant_message}: {risk.recommendation}
                </Badge>
            )}
            {(days > 1 || !!closed_at) && (
                <Badge text={'days:' + days} color={daysType(days)} className={classNames({'text-dark': days < 3})}/>
            )}
            {/*<PaymentBadge financial_status={financial_status}/>*/}
            <FulfillmentBadge fulfillment_status={fulfillment_status}/>
            {tagList.map(tag => (
                <Badge key={tag} text={tag} color="info"/>
            ))}
            {hasDiscount && (<Badge color="primary" text="disc"/>)}
            {!!cancelled_at && (
                <Badge color="warning">Cancelled: {new Date(cancelled_at).toLocaleDateString()}</Badge>)}
        </Fragment>
    );
}

export default ShopifyOrderStatus;
