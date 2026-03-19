import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import {useAppSelector} from "@/app/configureStore.ts";

const OrderItems = () => {
    const order = useAppSelector(selectCurrentOrder);

    if (!order || !order.graphqlOrder) {
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
                {order.graphqlOrder.lineItems.nodes.map(row => (
                    <tr key={row.id}>
                        <td>{row.sku}</td>
                        <td>{row.name}</td>
                        <td className="text-end">{row.quantity}</td>
                        <td className="text-end">{row.originalTotalSet.shopMoney.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default OrderItems;
