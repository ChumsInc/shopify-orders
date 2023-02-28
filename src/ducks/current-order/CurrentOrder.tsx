import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentOrder, selectLoading} from "./selectors";
import {Alert, LoadingProgressBar} from "chums-components";
import OrderImportButton from "../orders/OrderImportButton";
import LinkSalesOrder from "./LinkSalesOrder";
import format from "date-fns/format";
import parseJSON from "date-fns/parseJSON";
import OrderRisks from "./OrderRisks";
import OrderItems from "./OrderItems";
import OrderImportInfo from "./OrderImportInfo";
import FulfillButton from "./FulfillButton";
import OrderLink from "../orders/OrderLink";
import {useAppDispatch} from "../../app/configureStore";
import {loadOrder} from "./actions";

const CurrentOrder = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCurrentOrder);
    const loading = useSelector(selectLoading);

    const closeHandler = () => dispatch(loadOrder());

    if (!current) {
        return (
            <Alert color="info">Select an Order</Alert>
        )
    }

    const intranet_url = `/reports/account/salesorder/?company=CHI&salesorderno=${encodeURIComponent(current.sage_SalesOrderNo)}`;
    return (
        <div>
            <h3 className="d-flex justify-content-between align-items-baseline">
                <a href={intranet_url} target="_blank">{current.sage_SalesOrderNo}</a>
                <OrderImportButton id={current.id} import_status={current.import_status}/>
                <button className="btn btn-sm btn-close" onClick={closeHandler} />
            </h3>
            {loading && <LoadingProgressBar striped animated className="mb-3"/>}
            {(current.import_status === 'failed' || !current.import_result || current.import_result?.error || current.OrderStatus === 'X') && (
                <LinkSalesOrder/>
            )}
            {current.import_status === 'linked' && (
                <h4>{current.shopify_order?.name} linked to {current.sage_SalesOrderNo}</h4>
            )}
            <FulfillButton/>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{[current.shopify_order?.customer.first_name, current.shopify_order?.customer.last_name].join(' ')}</h5>
                    <div>{current.shopify_order?.customer.email}</div>
                    {!!current.shopify_order?.created_at && (
                        <div>Order Date: {format(parseJSON(current.shopify_order?.created_at), 'MM/dd/yyyy')}
                            {' '}
                            <small>{format(parseJSON(current.shopify_order?.created_at), 'hh:mm b')}</small>
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
                </div>
            </div>
            <OrderRisks/>
            <OrderItems/>
            <OrderImportInfo/>
        </div>
    )
}

export default CurrentOrder;
