import React from 'react';
import classNames from "classnames";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";

export default function LegacyRiskTable() {
    const order = useSelector(selectCurrentOrder);
    const risks = order?.shopify_order?.risks ?? [];

    if (!risks.length) {
        return null;
    }

    return (
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
    )
}
