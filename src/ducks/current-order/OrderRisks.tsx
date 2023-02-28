import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";
import {loadRisks} from "./actions";
import classNames from "classnames";

const OrderRisks = () => {
    const dispatch = useAppDispatch();
    const order = useSelector(selectCurrentOrder);
    const risks = order?.shopify_order?.risks ?? [];

    const clickHandler = () => {
        if (!order) {
            return;
        }
        dispatch(loadRisks(order?.id))
    }
    if (!order || !order.shopify_order) {
        return null;
    }

    return (
        <>
            <h5 onClick={clickHandler}>Risks</h5>

            <table className="table table-xs table-hover">
                <thead>
                <tr>
                    <th>Score</th>
                    <th>Message</th>
                    <th>Recommendation</th>
                </tr>
                </thead>
                <tbody>
                {risks.map(row => (
                    <tr key={row.id}>
                        <td>{row.score}</td>
                        <td>{row.message}</td>
                        <td className={classNames({'text-danger': row.recommendation !== 'accept'})}>{row.recommendation}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default OrderRisks;
