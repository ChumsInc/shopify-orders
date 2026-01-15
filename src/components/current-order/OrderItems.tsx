import {useSelector} from "react-redux";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";

const OrderItems = () => {
    const order = useSelector(selectCurrentOrder);

    if (!order || !order.shopify_order) {
        return null;
    }

    return (
        <>
            <h5>Items</h5>
            <table className="table table-xs table-hover">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Desc</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {order.shopify_order?.line_items?.map(row => (
                    <tr key={row.id}>
                        <td>{row.sku}</td>
                        <td>{row.name}</td>
                        <td className="text-end">{row.quantity}</td>
                        <td className="text-end">{row.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default OrderItems;
