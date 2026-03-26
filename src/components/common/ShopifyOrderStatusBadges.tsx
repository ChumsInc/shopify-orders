import {now} from "@/utils/utils.ts";
import Badge from "react-bootstrap/Badge";
import dayjs from "dayjs";
import type {Order} from "chums-types/shopify-graphql";
import PaymentGatewayBadge from "@/components/common/PaymentGatewayBadge.tsx";
import DaysBadge from "@/components/common/DaysBadge.tsx";
import FulfillmentBadge from "@/components/common/FulfillmentBadge.tsx";
import TagBadge from "@/components/common/TagBadge.tsx";

const ShopifyOrderStatusBadges = ({order}: { order: Order | null }) => {
    if (!order) {
        return null;
    }

    const hasDiscount = Number(order.totalDiscountsSet?.shopMoney.amount) > 0;
    return (
        <div className="d-inline-flex flex-wrap justify-content-start gap-1">
            {order.risk.recommendation !== 'ACCEPT' && (
                <Badge bg="danger">
                    <span className="bi-exclamation-triangle-fill me-1" />
                    {order.risk.recommendation}
                </Badge>
            )}
            <DaysBadge createdAt={order.createdAt ?? now()}/>
            {order.paymentGatewayNames?.map((gateway) => (
                <PaymentGatewayBadge gateway={gateway} key={gateway}/>
            ))}
            {order.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
            ))}
            {hasDiscount && (<Badge bg="success"><span className="bi-currency-dollar me-1" />Disc</Badge>)}
            <FulfillmentBadge status={order.displayFulfillmentStatus}/>
            {!!order.cancelledAt && (
                <Badge bg="warning">Cancelled: {dayjs(order.cancelledAt).format('MM/DD/YYYY')}</Badge>
            )}
        </div>
    );
}

export default ShopifyOrderStatusBadges;
