import {useState} from "react";
import AlertList from "@/components/alerts/AlertList.tsx";
import OrdersStatusBar from "@/components/orders-list/OrdersStatusBar.tsx";
import OrdersList from "@/components/orders-list/OrdersList.tsx";
import CurrentOrder from "@/components/current-order/CurrentOrder.tsx";
import FulfillmentList from "@/components/fulfillments/FulfillmentList.tsx";
import {Nav} from "react-bootstrap";
import {ErrorBoundary} from "react-error-boundary";
import AppErrorAlert from "@/app/AppErrorAlert.tsx";

export default function App() {
    const [tab, setTab] = useState('orders');

    return (
        <div>
            <AlertList/>
            <div className="row g-3">
                <div className="col-lg-8 col-md-7 col-6">
                    <div className="container-fluid">
                        <ErrorBoundary FallbackComponent={AppErrorAlert}>
                            <OrdersStatusBar/>
                            <OrdersList/>
                        </ErrorBoundary>
                    </div>
                </div>
                <div className="col-lg-4 col-md-5 col-6">
                    <Nav variant="tabs" activeKey={tab} className="mb-3">
                        <Nav.Item>
                            <Nav.Link eventKey="orders" onClick={() => setTab('orders')}>Current Order</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="fulfillments"
                                      onClick={() => setTab('fulfillments')}>Fulfillments</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="p-1">
                        <ErrorBoundary FallbackComponent={AppErrorAlert}>
                            {tab === 'orders' && (<CurrentOrder/>)}
                            {tab === 'fulfillments' && (<FulfillmentList/>)}
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    )
}
