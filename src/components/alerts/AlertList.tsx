import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {dismissAlert, selectAlerts} from "@/ducks/alerts";
import ContextAlert from "./ContextAlert.tsx";

export default function AlertList() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectAlerts);

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
