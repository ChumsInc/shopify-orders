import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {loadOrders} from "@/ducks/orders/actions.ts";
import Button from "react-bootstrap/Button";
import {selectOrdersStatus} from "@/ducks/orders/openOrdersSlice.ts";


export default function OrdersForm() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectOrdersStatus);

    const submitHandler = () => {
        dispatch(loadOrders());
    }

    return (
        <form action={submitHandler}>
            <Button color="primary" size="sm" type="submit" disabled={status !== 'idle'}>
                Load Orders
            </Button>
        </form>
    )
}
