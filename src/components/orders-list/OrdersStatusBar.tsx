import OrdersForm from "./OrdersForm.tsx";
import OrderStatusProgress from "@/components/orders-list/OrderStatusProgress.tsx";

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
