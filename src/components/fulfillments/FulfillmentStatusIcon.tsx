import type {OrderDisplayFulfillmentStatus} from "chums-types/shopify-graphql";

export default function FulfillmentStatusIcon({status}: { status?: OrderDisplayFulfillmentStatus }) {
    switch (status?.toLowerCase()) {
        case 'FULFILLED':
            return (<span className="bi-box-seam-fill me-3"/>)
        case 'REQUEST_DECLINED':
            return (<span className="bi-exclamation-triangle-fill me-3"/>)
    }
    return (
        <span className="bi-box-seam me-3"/>
    );
}
