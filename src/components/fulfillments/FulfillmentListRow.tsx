import type {OrderFulfillment} from "@/ducks/orders/fulfillmentStatusSlice.ts";
import classNames from "classnames";
import OrderLink from "@/components/orders-list/OrderLink.tsx";
import FulfillOrderButton from "@/components/fulfillments/FulfillOrderButton.tsx";
import FulfillmentStatusIcon from "@/components/fulfillments/FulfillmentStatusIcon.tsx";

export interface FulfillmentListRowProps {
    order: OrderFulfillment
}
export default function FulfillmentListRow({order}: FulfillmentListRowProps) {
    const className = classNames({
        'text-danger': order.status === 'REQUEST_DECLINED',
        'text-success': order.status === 'FULFILLED',
    })
    return (
        <tr className={className}>
            <td><OrderLink order_id={order.id}>{order.id}</OrderLink></td>
            <td>
                <FulfillmentStatusIcon status={order.status} />
                <span>{order.status}</span>
                {!!order.message && <span className="ms-3">{order.message}</span>}
            </td>
            <td>
                <FulfillOrderButton orderId={order.id} status={order.status} size="sm" className="btn-xs" />
            </td>
        </tr>
    )
}
