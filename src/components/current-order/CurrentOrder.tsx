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
import ProgressBar from "react-bootstrap/ProgressBar";
import dayjs from "dayjs";
import ImportStatusBadge from "@/components/orders-list/importStatusBadge.tsx";
import {Card, Col, Row} from "react-bootstrap";

const CurrentOrder = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectCurrentOrderStatus);
    const current = useSelector(selectCurrentOrder);

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
                    <ImportStatusBadge status={current.import_status} />
                </div>
                <div className="col-auto">
                    <FulfillButton/>
                </div>
                <div className="col-auto">
                    <OrderImportButton id={current.id} import_status={current.import_status}/>
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-close" onClick={closeHandler}/>
                </div>
            </div>
            <h3 className="d-flex justify-content-between align-items-baseline">

            </h3>
            {status !== 'idle' && <ProgressBar striped animated className="mb-3" now={100}/>}
            <ImportAlerts/>
            <OrderImportInfo/>
            {(current.import_status === 'failed' || !current.import_result || current.import_result?.error || current.OrderStatus === 'X') && (
                <LinkSalesOrder/>
            )}
            {current.import_status === 'linked' && (
                <h4>{current.shopify_order?.name} linked to {current.sage_SalesOrderNo}</h4>
            )}
            <Card>
                <Card.Header as="h3">
                    {[current.shopify_order?.customer?.first_name, current.shopify_order?.customer?.last_name].join(' ')}
                </Card.Header>
                <Card.Body>
                    <div>{current.shopify_order?.customer?.email}</div>
                    {!!current.shopify_order?.created_at && (
                        <div>Order Date: {dayjs(current.shopify_order.created_at).format('MM/DD/YYYY')}
                            {' '}
                            <small>{dayjs(current.shopify_order.created_at).format('hh:mm a')}</small>
                        </div>
                    )}
                    <div>
                        Shopify Order Page:
                        <OrderLink order_id={current.id} className="ms-3">{current.id}</OrderLink>
                    </div>
                    <div>
                        Customer Status Page:
                        <a className="ms-3" href={current.shopify_order?.order_status_url}
                           target="_blank">{current.shopify_order?.name}</a>
                    </div>
                </Card.Body>
                {current.shopify_order && (
                    <Card.Body>
                        <Row className="g-3">
                            <Col>
                                <Card.Title>Billing Address</Card.Title>
                                <address style={{fontStyle: 'italic', fontSize: 'small'}}>
                                    <div>{current.shopify_order.billing_address.name}</div>
                                    <div>{current.shopify_order.billing_address.address1}</div>
                                    <div>{current.shopify_order.billing_address.address2}</div>
                                    <div>
                                        <span className="me-1">{current.shopify_order.billing_address.city}</span>
                                        <span className="me-1">{current.shopify_order.billing_address.province_code}</span>
                                        <span className="me-1">{current.shopify_order.billing_address.country_code}</span>
                                        <span className="me-1">{current.shopify_order.billing_address.zip}</span>
                                    </div>
                                </address>
                            </Col>
                            <Col>
                                <Card.Title>Delivery Address</Card.Title>
                                <address style={{fontStyle: 'italic', fontSize: 'small'}}>
                                    <div>{current.shopify_order.shipping_address.name}</div>
                                    <div>{current.shopify_order.shipping_address.address1}</div>
                                    <div>{current.shopify_order.shipping_address.address2}</div>
                                    <div>
                                        <span className="me-1">{current.shopify_order.shipping_address.city}</span>
                                        <span className="me-1">{current.shopify_order.shipping_address.province_code}</span>
                                        <span className="me-1">{current.shopify_order.shipping_address.country_code}</span>
                                        <span className="me-1">{current.shopify_order.shipping_address.zip}</span>
                                    </div>
                                </address>
                            </Col>
                        </Row>
                    </Card.Body>
                )}
            </Card>
            <OrderRisks/>
            <OrderItems/>
            <OrderJSON/>
        </div>
    )
}

export default CurrentOrder;
