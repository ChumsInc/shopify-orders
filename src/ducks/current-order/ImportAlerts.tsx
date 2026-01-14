import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";

export default function ImportAlerts() {
    const current = useSelector(selectCurrentOrder);
    const alerts = current?.import_result?.validation ?? [];
    if (!alerts.length) {
        return null;
    }
    return (
        <div className="alert alert-warning">
            {alerts.map((message, index) => (
                <div key={index}>{message}</div>
            ))}
        </div>
    )
}
