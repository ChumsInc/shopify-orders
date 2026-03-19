import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import Alert from "react-bootstrap/Alert";
import {useAppSelector} from "@/app/configureStore.ts";

export default function ImportAlerts() {
    const current = useAppSelector(selectCurrentOrder);
    const validation: string[] = current?.import_result?.validation ?? [];
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
