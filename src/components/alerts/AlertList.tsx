import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "@/ducks/alerts";
import ContextAlert from "./ContextAlert.tsx";

export default function AlertList() {
    const dispatch = useAppDispatch();
    const list = useSelector(selectAlerts);

    return (
        <div>
            {list.map(alert => (
                <ContextAlert key={alert.id} context={alert.context} count={alert.count}
                              variant={alert.variant ?? 'warning'}
                              dismissible onClose={() => dispatch(dismissAlert(alert))}>
                    {alert.message}
                </ContextAlert>
            ))}
        </div>
    )
}
