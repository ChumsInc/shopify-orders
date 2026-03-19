import Badge from "react-bootstrap/esm/Badge";
import type {OrderDisplayFulfillmentStatus} from "chums-types/shopify-graphql";
import type {Variant} from "react-bootstrap/esm/types";

export interface FulfillmentBadgeProps {
    status: OrderDisplayFulfillmentStatus | string | null;
}

export default function FulfillmentBadge({status}: FulfillmentBadgeProps) {
    if (!status) {
        return null;
    }
    return (
        <Badge bg={fulfillmentBadgeVariant(status)}>
            <FulfillmentIcon status={status}/>
            {status}
        </Badge>
    )
}

function fulfillmentBadgeVariant(status: OrderDisplayFulfillmentStatus | string | null): Variant {
    switch (status) {
        case 'OPEN':
        case 'UNFULFILLED':
            return 'secondary';
        case 'ON_HOLD':
            return 'danger';
        case 'PARTIALLY_FULFILLED':
            return 'warning';
        case 'FULFILLED':
            return 'success';
        case 'PENDING_FULFILLMENT':
        case 'IN_PROGRESS':
        case 'SCHEDULED':
            return 'primary';
        default:
            return 'danger';
    }
}

function FulfillmentIcon({status}: { status: OrderDisplayFulfillmentStatus | string | null }) {
    switch (status) {
        case 'OPEN':
        case 'UNFULFILLED':
            return <span className="bi-box-seam me-1"/>;
        case 'PARTIALLY_FULFILLED':
        case 'FULFILLED':
        case 'PENDING_FULFILLMENT':
            return <span className="bi-box-seam-fill me-1"/>;
        case 'IN_PROGRESS':
        case 'SCHEDULED':
            return <span className="bi-clock-history me-1"/>;
        default:
            return <span className="bi-exclamation-triangle-fill me-1"/>;
    }
}
