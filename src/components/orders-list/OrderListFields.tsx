import type {SortableTableField} from "@chumsinc/sortable-tables";
import type {ShopifyOrderRow} from "@/ducks/types.ts";
import OrderLink from "@/components/orders-list/OrderLink.tsx";
import ImportStatusBadge from "@/components/orders-list/importStatusBadge.tsx";
import {friendlyDate} from "@/utils/date-utils.ts";
import DeliveryAddress from "@/components/orders-list/DeliveryAddress.tsx";
import ShippingField from "@/components/orders-list/ShippingField.tsx";
import ShopifyOrderStatus from "@/components/orders-list/ShopifyOrderStatus.tsx";
import numeral from "numeral";

export const orderListFields: SortableTableField<ShopifyOrderRow>[] = [
    {
        field: 'sage_SalesOrderNo',
        title: <span className="text-nowrap">Order #</span>,
        render: (row) => (
            <OrderLink order_id={row.id}>
                {row.sage_SalesOrderNo ?? row.id}
            </OrderLink>
        ),
        sortable: true
    },
    {
        field: 'import_status',
        title: 'Status',
        render: (row) => (
            <div className="d-flex gap-1 align-items-center">
                <div><ImportStatusBadge status={row.import_status}/></div>
                <div className="badge bg-light border rounded text-dark">{row.OrderStatus ?? '-'}</div>
            </div>
        ),
        sortable: true
    },
    {
        field: 'createdAt',
        title: 'Date',
        render: (row) => friendlyDate(row.graphqlOrder?.createdAt ?? null),
        sortable: true
    },
    {
        field: 'customer',
        title: 'Customer',
        render: (row) => row.graphqlOrder?.billingAddress?.name ?? '',
        sortable: true
    },
    {
        field: 'shippingAddress',
        title: 'Delivery',
        render: (row) => <DeliveryAddress address={row.graphqlOrder?.shippingAddress}/>,
        sortable: true
    },
    {
        field: 'shippingLines', title: 'Shipping', render: (row) => (
            <ShippingField shipVia={row.ShipVia} order={row.graphqlOrder}/>
        ), className: 'shipping-description',
        sortable: true
    },
    {
        field: 'displayFulfillmentStatus',
        title: 'Status',
        className: 'status-badges',
        render: (row) => (<ShopifyOrderStatus order={row.graphqlOrder}/>),
    },
    // {
    //     field: 'OrderStatus',
    //     title: <span className="text-nowrap">SO Status</span>,
    //     render: (row) => row.OrderStatus || '',
    //     align: "center",
    //     sortable: true
    // },
    {
        field: 'InvoiceNo',
        title: <span className="text-nowrap">Invoice #</span>,
        render: (row) => row.InvoiceNo || '',
        sortable: true
    },
    {
        field: 'totalPriceSet',
        title: 'Total',
        render: (row) => numeral(row.graphqlOrder?.currentTotalPriceSet?.shopMoney?.amount ?? 0).format('$0,0.00'),
        align: 'end',
        sortable: true,
    },
]
