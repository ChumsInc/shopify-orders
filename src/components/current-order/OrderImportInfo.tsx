import {useSelector} from "react-redux";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import Alert from "react-bootstrap/Alert";

export default function OrderImportInfo() {
    const order = useSelector(selectCurrentOrder);
    if (!order) {
        return null;
    }

    if (order.import_status === 'waiting') {
        return (
            <Alert variant="info">
                <strong className="me-1">New Order:</strong>
                New orders wait for two minutes prior to importing to allow for complete risk assessment.
            </Alert>
        )
    }

    return (
        <div>
            {order.import_status !== 'successful' && (
                <Alert variant="danger">
                    <strong className="me-1">Import Error:</strong>
                    {order.import_result?.error ?? null}
                </Alert>
            )}
        </div>
    )
}
