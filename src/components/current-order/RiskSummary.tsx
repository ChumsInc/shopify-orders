import classNames from "classnames";
import type {OrderRiskSummary} from "chums-types/shopify";
import {useState} from "react";
import {Button, Col, Collapse, Row} from "react-bootstrap";

export interface RiskSummaryProps {
    risk?: OrderRiskSummary;
    expanded?: boolean;
}

export default function RiskSummary({
                                        risk,
                                        expanded = false,
                                    }: RiskSummaryProps) {
    const [show, setShow] = useState(expanded);
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
            <Row className="g-3 align-items-center">
                <Col>
                    <div className={recommendationClassName}>
                        <strong>Shopify Recommendation: {risk.recommendation}</strong>
                    </div>
                </Col>
                <Col xs="auto">
                    <Button variant={show ? 'secondary' : 'outline-secondary'} size="sm"
                            onClick={() => setShow(!show)}>
                        Show Summary
                    </Button>
                </Col>
            </Row>
            <Collapse in={show}>
                <div>
                    <table className="table table-xs table-hover">
                        <thead>
                        <tr>
                            <th>Fact</th>
                            <th>Assessment</th>
                        </tr>
                        </thead>
                        <tbody>
                        {risk.assessments?.[0]?.facts
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
                </div>
            </Collapse>
        </div>
    )
}
