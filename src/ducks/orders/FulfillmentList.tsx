import React from 'react';
import {useSelector} from "react-redux";
import {selectFulfillmentsErrors, selectFulfillmentsList} from "./selectors";
import OrderLink from "./OrderLink";
import FulfillAllButton from "./FulfillAllButton";
import {Progress, ProgressBar} from "chums-components";
import classNames from "classnames";
import {FulfillmentStatus} from "../types";

const FulfillmentStatusIcon = ({status}: { status?: FulfillmentStatus }) => {
    switch (status) {
    case 'fulfilled':
        return (<span className="bi-check-circle-fill me-1" />)
    case 'error':
        return (<span className="bi-exclamation-triangle-fill me-1" />)
    }
    return null;
}
const FulfillmentList = () => {
    const list = useSelector(selectFulfillmentsList)
    const errors = useSelector(selectFulfillmentsErrors);
    const submitList = Object.keys(list).filter(value => list[value] !== 'open');
    const pending = Object.keys(list).filter(value => list[value] === 'pending').length;

    return (
        <div>
            <FulfillAllButton/>
            <Progress className="my-3">
                <ProgressBar valueMin={0} valueMax={submitList.length} value={submitList.length - pending}
                             color="success"/>
                <ProgressBar valueMin={0} valueMax={submitList.length} value={pending} color="info"/>
            </Progress>
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

export default FulfillmentList;
