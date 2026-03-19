import {useSelector} from "react-redux";
import {selectCurrentOrder, selectCurrentOrderStatus} from "@/ducks/current-order/index.ts";
import OrderImportButton from "@/components/current-order/OrderImportButton.tsx";
import LinkSalesOrder from "./LinkSalesOrder.tsx";
import OrderRisks from "./OrderRisks.tsx";
import OrderItems from "./OrderItems.tsx";
import OrderImportInfo from "./OrderImportInfo.tsx";
import FulfillButton from "./FulfillButton.tsx";
import OrderLink from "@/components/orders-list/OrderLink.tsx";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {loadOrder} from "@/ducks/current-order/actions.ts";
import ImportAlerts from "./ImportAlerts.tsx";
import OrderJSON from "./OrderJSON.tsx";
import Alert from 'react-bootstrap/Alert'
import dayjs from "dayjs";
import ImportStatusBadge from "@/components/orders-list/importStatusBadge.tsx";
import {Card, Col, Row, Spinner} from "react-bootstrap";
import {selectCurrentFulfillment} from "@/ducks/orders/fulfillmentStatusSlice.ts";
import FulfillmentBadge from "@/components/common/FulfillmentBadge.tsx";

export default function CurrentOrder() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectCurrentOrderStatus);
    const current = useSelector(selectCurrentOrder);
    const fulfillment = useAppSelector(selectCurrentFulfillment);

    const closeHandler = () => dispatch(loadOrder());

    if (!current) {
        return (
            <Alert variant="info">Select an Order</Alert>
        )
    }

    const intranet_url = `/reports/account/salesorder/?company=CHI&salesorderno=${encodeURIComponent(current.sage_SalesOrderNo)}`;
    return (
        <div>
            <div className="row g-3 align-items-center">
                <h3 className="col-auto">
                    <a href={intranet_url} target="_blank">{current.sage_SalesOrderNo}</a>
                </h3>
                <div className="col">
                    <ImportStatusBadge status={current.import_status}/>
                </div>
                <div className="col-auto">
                    <FulfillButton disabled={!current.InvoiceNo}/>
                </div>
                <div className="col-auto">
                    <OrderImportButton id={current.id} import_status={current.import_status}/>
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-close" onClick={closeHandler}/>
                </div>
            </div>
            <ImportAlerts/>
            <OrderImportInfo/>
            {(current.import_status === 'failed' || !current.import_result || current.import_result?.error || current.OrderStatus === 'X') && (
                <LinkSalesOrder/>
            )}
            {current.import_status === 'linked' && (
                <h4>{current.graphqlOrder?.name} linked to {current.sage_SalesOrderNo}</h4>
            )}
            <Card>
                <Card.Header>
                    <Row className="g-3 align-items-baseline">
                        <Col>
                            <h3>
                                {current.graphqlOrder?.billingAddress?.name ?? ''}
                            </h3>
                        </Col>
                        <Col xs="auto">
                            <Spinner animation="border" size="sm" role="status" aria-hidden="true" variant="info"
                                     hidden={status === 'idle'}/>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <div>
                        {current.graphqlOrder?.email}
                    </div>
                    {!!current.graphqlOrder?.createdAt && (
                        <div>
                            <strong className="me-3">Order Date:</strong>
                            <span className="me-3">{dayjs(current.graphqlOrder.createdAt).format('MM/DD/YYYY')}</span>
                            <small>{dayjs(current.graphqlOrder.createdAt).format('hh:mm a')}</small>
                        </div>
                    )}
                    <div>
                        <strong className="me-3">Shopify Order Page:</strong>
                        <OrderLink order_id={current.id} className="ms-3">{current.id}</OrderLink>
                    </div>
                </Card.Body>
                {current.graphqlOrder && (
                    <Card.Body>
                        <Row className="g-3">
                            <Col>
                                <Card.Title>Billing Address</Card.Title>
                                <address style={{fontStyle: 'italic', fontSize: 'small'}}>
                                    <div>{current.graphqlOrder.billingAddress?.name}</div>
                                    <div>{current.graphqlOrder.billingAddress?.address1}</div>
                                    <div>{current.graphqlOrder.billingAddress?.address2}</div>
                                    <div>
                                        <span className="me-1">{current.graphqlOrder.billingAddress?.city}</span>
                                        <span
                                            className="me-1">{current.graphqlOrder.billingAddress?.provinceCode}</span>
                                        <span
                                            className="me-1">{current.graphqlOrder.billingAddress?.countryCodeV2}</span>
                                        <span className="me-1">{current.graphqlOrder.billingAddress?.zip}</span>
                                    </div>
                                </address>
                            </Col>
                            <Col>
                                <Card.Title>Delivery Address</Card.Title>
                                <address style={{fontStyle: 'italic', fontSize: 'small'}}>
                                    <div>{current.graphqlOrder.shippingAddress?.name}</div>
                                    <div>{current.graphqlOrder.shippingAddress?.address1}</div>
                                    <div>{current.graphqlOrder.shippingAddress?.address2}</div>
                                    <div>
                                        <span className="me-1">{current.graphqlOrder.shippingAddress?.city}</span>
                                        <span className="me-1">
                                            {current.graphqlOrder.shippingAddress?.provinceCode}
                                        </span>
                                        <span className="me-1">
                                            {current.graphqlOrder.shippingAddress?.countryCodeV2}
                                        </span>
                                        <span className="me-1">{current.graphqlOrder.shippingAddress?.zip}</span>
                                    </div>
                                </address>
                            </Col>
                        </Row>
                    </Card.Body>
                )}
                {fulfillment && fulfillment?.status !== 'UNFULFILLED' && (
                    <Card.Body className="border-top">
                        <h4>Fulfillment Status</h4>
                        <FulfillmentBadge status={fulfillment.status}/>
                        <div className="text-secondary">
                            {fulfillment.message}
                        </div>
                    </Card.Body>
                )}
            </Card>
            <OrderRisks/>
            <OrderItems/>
            <OrderJSON/>
        </div>
    )
}
