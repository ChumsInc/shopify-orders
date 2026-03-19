import Badge from "react-bootstrap/esm/Badge";
import type {Order} from "chums-types/shopify-graphql";

export interface ShippingFieldProps {
    shipVia: string | null;
    order: Order | null;
}

export default function ShippingField({shipVia, order}: ShippingFieldProps) {
    const title = order?.shippingLines.nodes?.map(line => line.code).join('; ');
    return (
        <div className="d-flex flex-wrap flex-column gap-1">
            <div><Badge bg="info" text="dark">{shipVia}</Badge></div>
            <div>
                <small className="text-secondary ms-1" title={title}>
                    {order?.shippingLines.nodes.map(line => line.title).join('; ')}
                </small>
            </div>
        </div>
    )
}
