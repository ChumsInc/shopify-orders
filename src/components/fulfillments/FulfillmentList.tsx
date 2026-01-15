import {useSelector} from "react-redux";
import {selectFulfillmentsErrors, selectFulfillmentsList} from "@/ducks/orders/selectors.ts";
import OrderLink from "../orders-list/OrderLink.tsx";
import FulfillAllButton from "./FulfillAllButton.tsx";
import classNames from "classnames";
import type {FulfillmentStatus} from "@/ducks/types.ts";
import ProgressBar from "react-bootstrap/ProgressBar";

const FulfillmentStatusIcon = ({status}: { status?: FulfillmentStatus }) => {
    switch (status) {
    case 'fulfilled':
        return (<span className="bi-check-circle-fill me-1" />)
    case 'error':
        return (<span className="bi-exclamation-triangle-fill me-1" />)
    }
    return null;
}

export default function FulfillmentList() {
    const list = useSelector(selectFulfillmentsList)
    const errors = useSelector(selectFulfillmentsErrors);
    const submitList = Object.keys(list).filter(value => list[value] !== 'open');
    const pending = Object.keys(list).filter(value => list[value] === 'pending').length;

    return (
        <div>
            <FulfillAllButton/>
            <ProgressBar className="my-3">
                <ProgressBar min={0} max={submitList.length} now={submitList.length - pending}
                             color="success"/>
                <ProgressBar min={0} max={submitList.length} now={pending} color="info"/>
            </ProgressBar>
            <table className="table table-xs table-hover">
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {submitList.map(key => (
                    <tr key={key}
                        className={classNames({'text-danger': !!errors[key], 'text-success': list[key] === 'fulfilled'})}>
                        <td><OrderLink order_id={key}>{key}</OrderLink></td>
                        <td>
                            <FulfillmentStatusIcon status={list[key]} />
                            {!errors[key] && <span>{list[key]}</span>}
                            {!!errors[key] && <span>{errors[key]}</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
