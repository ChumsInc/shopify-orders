import type {ShopifyOrder} from "chums-types";
import Badge from "react-bootstrap/esm/Badge";

export interface ShippingFieldProps {
    shipVia: string|null;
    order: ShopifyOrder|null;
}
export default function ShippingField({shipVia, order}:ShippingFieldProps) {
    return (
        <div className="d-flex flex-wrap flex-row gap-1">
            <Badge bg="info" text="dark">{shipVia}</Badge>
            {order?.shipping_lines?.length && (
                <small className="text-secondary ms-1"
                       title={order?.shipping_lines.map(line => line.title).join('; ')}>
                    {order?.shipping_lines.map(line => line.title).join('; ')}
                </small>
            )}
        </div>
    )
}
