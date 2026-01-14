import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";
import {Alert, FormCheck} from "chums-components";
import {JSONView} from "json-view";

const OrderImportInfo = () => {
    const [open, setOpen] = useState<boolean>(false);
    const order = useSelector(selectCurrentOrder);
    if (!order) {
        return null;
    }

    if (order.import_status === 'waiting') {
        return (
            <Alert color="info">
                <strong className="me-1">New Order:</strong>
                New orders wait for two minutes prior to importing to allow for complete risk assessment.
            </Alert>
        )
    }

    return (
        <div>
            {order.import_status !== 'successful' && (
                <Alert color="danger">
                    <strong className="me-1">Import Error:</strong>
                    {order.import_result?.error ?? null}
                </Alert>
            )}
        </div>
    )
}

export default OrderImportInfo;
