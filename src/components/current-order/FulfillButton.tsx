import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import {selectOrderFulfillment} from "@/ducks/orders/selectors.ts";
import {fulfillOrder} from "@/ducks/current-order/actions.ts";


const FulfillButton = () => {
    const dispatch = useAppDispatch();
    const order = useSelector(selectCurrentOrder);
    const fulfillment = useAppSelector(state => selectOrderFulfillment(state, order?.id ?? 0));

    const clickHandler = () => {
        if (order && order.shopify_order) {
            dispatch(fulfillOrder(order.shopify_order?.id))
        }
    }

    if (!order) {
        return null;
    }
    return (
        <button type="button" className="btn btn-sm btn-success"
                disabled={fulfillment !== 'invoiced'} onClick={clickHandler}>
            Fulfill Order
        </button>
    )
}

export default FulfillButton;
