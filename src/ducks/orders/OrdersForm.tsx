import React, {FormEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import OrderStatusSelect from "./OrdersStatusSelect";
import OrdersFilterFromDate from "./OrdersFilterFromDate";
import OrdersFilterToDate from "./OrdersFilterToDate";
import {SpinnerButton} from "chums-components";
import {selectFilterStatus, selectLoading} from "./selectors";
import {loadOrders} from "./actions";


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
                    <SpinnerButton color="primary" spinning={loading} type="submit" size="sm">
                        Load Orders
                    </SpinnerButton>
                </div>
            </div>

        </form>
    )
}
