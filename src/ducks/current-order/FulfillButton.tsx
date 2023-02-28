import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";
import {selectOrderFulfillment} from "../orders/selectors";
import {fulfillOrder} from "./actions";


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
        <div className="d-flex align-items-baseline mb-2">
            <button type="button" className="btn btn-sm btn-outline-success"
                    disabled={fulfillment !== 'invoiced'} onClick={clickHandler}>
                Fulfill Order
            </button>
            <div className="ms-3">Status: {fulfillment}</div>
        </div>
    )
}

export default FulfillButton;
