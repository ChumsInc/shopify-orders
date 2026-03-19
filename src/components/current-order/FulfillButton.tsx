import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import {fulfillOrder} from "@/ducks/current-order/actions.ts";
import {selectCurrentFulfillment} from "@/ducks/common-selectors.ts";
import {Button, type ButtonProps} from "react-bootstrap";

const FulfillButton = ({...rest}: ButtonProps) => {
    const dispatch = useAppDispatch();
    const order = useAppSelector(selectCurrentOrder);
    const fulfillment = useAppSelector(selectCurrentFulfillment);

    const clickHandler = () => {
        if (order && order.graphqlOrder) {
            dispatch(fulfillOrder(order.graphqlOrder.legacyResourceId))
        }
    }

    if (!order) {
        return null;
    }

    const disabled = !fulfillment || fulfillment.status === 'FULFILLED'
        || fulfillment.status === 'PENDING_FULFILLMENT' || fulfillment.status === 'IN_PROGRESS'
        || fulfillment.status === 'ON_HOLD';
    const variant = (fulfillment?.status === 'REQUEST_DECLINED' || fulfillment?.status === 'ON_HOLD')
        ? 'danger'
        : 'success';
    return (
        <Button type="button" size="sm" variant={variant}
                disabled={disabled}
                onClick={clickHandler} {...rest}>
            Fulfill Order: {fulfillment?.status}
        </Button>
    )
}

export default FulfillButton;
