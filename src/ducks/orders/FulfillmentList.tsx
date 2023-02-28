import React from 'react';
import {useSelector} from "react-redux";
import {selectFulfillmentsList} from "./selectors";
import OrderLink from "./OrderLink";
import FulfillAllButton from "./FulfillAllButton";
import {Progress, ProgressBar} from "chums-components";

const FulfillmentList = () => {
    const list = useSelector(selectFulfillmentsList)
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
                    <tr key={key}>
                        <td><OrderLink order_id={key}>{key}</OrderLink></td>
                        <td>{list[key]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default FulfillmentList;
