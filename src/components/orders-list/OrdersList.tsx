import {useEffect} from 'react';
import {type SortableTableField, StandaloneSortableTable, TablePagination} from "@chumsinc/sortable-tables";
import type {ShopifyOrderRow} from "@/ducks/types.ts";
import ShopifyOrderStatus from "./ShopifyOrderStatus.tsx";
import type {SortProps} from "chums-types";
import OrderLink from "./OrderLink.tsx";
import {friendlyDate} from "@/utils/date-utils.ts";
import numeral from "numeral";
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {loadOrders, setPage, setRowsPerPage, setSort} from "@/ducks/orders/actions.ts";
import classNames from "classnames";
import DeliveryAddress from "./DeliveryAddress.tsx";
import {loadOrder} from "@/ducks/current-order/actions.ts";
import {selectPage, selectRowsPerPage, selectSort, selectSortedList} from "@/ducks/orders/selectors.ts";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import ImportStatusBadge from "@/components/orders-list/importStatusBadge.tsx";
import ShippingField from "@/components/orders-list/ShippingField.tsx";

const fields: SortableTableField<ShopifyOrderRow>[] = [
    {
        field: 'sage_SalesOrderNo',
        title: <span className="text-nowrap">Order #</span>,
        render: (row) => (
            <OrderLink order_id={row.id}>
                {row.import_status === 'successful' ? row.sage_SalesOrderNo : row.id}
            </OrderLink>
        ),
        sortable: true
    },
    {
        field: 'import_status',
        title: 'Import',
        render: (row) => <ImportStatusBadge status={row.import_status}/>,
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
        render: (row) => `${row.shopify_order?.customer?.first_name ?? ''} ${row.shopify_order?.customer?.last_name ?? ''}`,
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
            <ShippingField shipVia={row.ShipVia} order={row.shopify_order}/>
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
        align: "center",
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
        render: (row) => numeral(row.shopify_order?.total_price_set?.presentment_money?.amount ?? 0).format('$0,0.00'),
        align: 'end',
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

    const sortChangeHandler = (sort: SortProps<ShopifyOrderRow>) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));
    const onSelectRow = (row: ShopifyOrderRow) => {
        dispatch(loadOrder(row))
    }

    return (
        <div>
            <StandaloneSortableTable fields={fields} currentSort={sort}
                                     data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                     keyField="id" onChangeSort={sortChangeHandler}
                                     selected={row => row.id === current?.id}
                                     rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             size="sm" showFirst showLast
                             count={list.length}/>
        </div>
    )
}
export default OrdersList;
