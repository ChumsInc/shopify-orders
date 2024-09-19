import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";
import classNames from "classnames";

export default function RiskSummary() {
    const order = useSelector(selectCurrentOrder);
    const risk = order?.shopify_order?.risk ?? null;

    if (!risk) {
        return null;
    }
    const recommendationClassName = classNames({
        'text-danger': risk.recommendation === 'CANCEL',
        'text-warning': risk.recommendation === 'INVESTIGATE' || risk.recommendation === 'NONE',
        'text-success': risk.recommendation === 'ACCEPT',
    })
    return (
        <div>
            <div className={recommendationClassName}><strong>Shopify Recommendation: {risk.recommendation}</strong></div>
            {!!risk.assessments.length && (
                <>
                    <div>Risk Level: {risk.assessments[0].riskLevel}</div>
                    <table className="table table-xs table-hover">
                        <thead>
                        <tr>
                            <th>Fact</th>
                            <th>Assessment</th>
                        </tr>
                        </thead>
                        <tbody>
                        {risk.assessments[0].facts
                            .map((row, index) => (
                                <tr key={index}>
                                    <td><em>{row.description}</em></td>
                                    <td className={classNames({
                                        'text-danger': row.sentiment === 'NEGATIVE',
                                        'text-success': row.sentiment === 'POSITIVE',
                                    })}>{row.sentiment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}
