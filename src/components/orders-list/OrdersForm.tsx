import type {FormEvent} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import OrderStatusSelect from "./OrdersStatusSelect.tsx";
import OrdersFilterFromDate from "./OrdersFilterFromDate.tsx";
import OrdersFilterToDate from "./OrdersFilterToDate.tsx";
import {selectFilterStatus, selectLoading} from "@/ducks/orders/selectors.ts";
import {loadOrders} from "@/ducks/orders/actions.ts";
import Button from "react-bootstrap/Button";


export default function OrdersForm() {
    const dispatch = useAppDispatch();
    const status = useSelector(selectFilterStatus);
    const loading = useSelector(selectLoading);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadOrders());
    }
    return (
        <form onSubmit={submitHandler}>
            <div className="row g-3">
                <div className="col-auto">
                    <OrderStatusSelect/>
                </div>
                {status !== 'open' && (
                    <div className="col-auto">
                        <OrdersFilterFromDate/>
                    </div>
                )}
                {status !== 'open' && (
                    <div className="col-auto">
                        <OrdersFilterToDate/>
                    </div>
                )}
                <div className="col-auto">
                    <Button color="primary" size="sm" type="submit" disabled={loading}>
                        Load Orders
                    </Button>
                </div>
            </div>

        </form>
    )
}
