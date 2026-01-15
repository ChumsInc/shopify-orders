import {useSelector} from "react-redux";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import Alert from "react-bootstrap/Alert";

export default function ImportAlerts() {
    const current = useSelector(selectCurrentOrder);
    const validation:string[] = current?.import_result?.validation ?? [];
    if (!validation.length) {
        return null;
    }
    return (
        <Alert variant="warning">
            {validation.map((message, index) => (
                <div key={index}>{message}</div>
            ))}
        </Alert>
    )
}
