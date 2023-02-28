import React from 'react';
import OrdersForm from "./OrdersForm";
import OrderStatusProgress from "../../components/OrderStatusProgress";

export default function OrdersStatusBar() {
    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <OrdersForm/>
            </div>
            <div className="col">
                <OrderStatusProgress />
            </div>
        </div>
    )
}
