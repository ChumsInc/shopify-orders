import React, {useEffect} from 'react';
import {Badge, SortableTable, SortableTableField, TablePagination} from "chums-components";
import {ShopifyOrderRow} from "../types";
import OrderImportButton from "./OrderImportButton";
import ShopifyOrderStatus from "./ShopifyOrderStatus";
import {SortProps} from "chums-types";
import OrderLink from "./OrderLink";
import {friendlyDate} from "../../date-utils";
import numeral from "numeral";
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {loadOrders, setPage, setRowsPerPage, setSort} from "./actions";
import classNames from "classnames";
import DeliveryAddress from "./DeliveryAddress";
import {loadOrder} from "../current-order/actions";
import {selectPage, selectRowsPerPage, selectSort, selectSortedList} from "./selectors";
import {selectCurrentOrder} from "../current-order/selectors";

const fields: SortableTableField<ShopifyOrderRow>[] = [
    {
        field: 'sage_SalesOrderNo',
        title: <span className="text-nowrap">Order #</span>,
        render: (row) => (
            <OrderLink
                order_id={row.id}>{row.import_status === 'successful' ? row.sage_SalesOrderNo : row.id}</OrderLink>),
        sortable: true
    },
    {
        field: 'import_status',
        title: 'Import',
        render: (row) => <OrderImportButton id={row.shopify_order?.id ?? null} import_status={row.import_status}/>,
        sortable: true
    },
    {
        field: 'created_at',
        title: 'Date',
        render: (row) => friendlyDate(row.shopify_order?.created_at ?? null),
        sortable: true
    },
    {
        field: 'customer',
        title: 'Customer',
        render: (row) => `${row.shopify_order?.customer.first_name ?? ''} ${row.shopify_order?.customer.last_name ?? ''}`,
        sortable: true
    },
    {
        field: 'shipping_address',
        title: 'Delivery',
        render: (row) => <DeliveryAddress address={row.shopify_order?.shipping_address}/>,
        sortable: true
    },
    {
        field: 'shipping_lines', title: 'Shipping', render: (row) => (
            <>
                <Badge color="light" className="text-dark">{row.ShipVia}</Badge>
                {row.shopify_order?.shipping_lines.length && (
                    <small className="shipping-description ms-1"
                           title={row.shopify_order.shipping_lines.map(line => line.title).join('; ')}>
                        {row.shopify_order.shipping_lines.map(line => line.title).join('; ')}
                    </small>
                )}
            </>
        ), className: 'shipping-description',
        sortable: true
    },
    {
        field: 'fulfillment_status',
        title: 'Status',
        className: 'status-badges',
        render: (row) => (<ShopifyOrderStatus order={row.shopify_order}/>),
    },
    {
        field: 'OrderStatus',
        title: <span className="text-nowrap">SO Status</span>,
        render: (row) => row.OrderStatus || '',
        sortable: true
    },
    {
        field: 'InvoiceNo',
        title: <span className="text-nowrap">Invoice #</span>,
        render: (row) => row.InvoiceNo || '',
        sortable: true
    },
    {
        field: 'total_price_usd',
        title: 'Total',
        render: (row) => numeral(row.shopify_order?.total_price_set.presentment_money.amount).format('$0,0.00'),
        className: 'right',
        sortable: true,
    },
]

const rowClassName = (row: ShopifyOrderRow) => {
    return classNames({
        'text-danger': row.import_status === 'failed',
        'text-success': !!row.InvoiceNo,
    })
}

const OrdersList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectSortedList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const sort = useSelector(selectSort);
    const current = useSelector(selectCurrentOrder);

    useEffect(() => {
        dispatch(loadOrders());
    }, [])

    const sortChangeHandler = (sort: SortProps) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));
    const onSelectRow = (row: ShopifyOrderRow) => {
        dispatch(loadOrder(row))
    }

    return (
        <div>
            <SortableTable fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} keyField="id" onChangeSort={sortChangeHandler}
                           selected={current?.id}
                           rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             bsSize="sm" showFirst showLast
                             count={list.length}/>
        </div>
    )
}
export default OrdersList;
