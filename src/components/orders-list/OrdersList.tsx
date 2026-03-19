import {useEffect} from 'react';
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import type {ShopifyOrderRow} from "@/ducks/types.ts";
import type {SortProps} from "chums-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {loadOrders} from "@/ducks/orders/actions.ts";
import classNames from "classnames";
import {loadOrder} from "@/ducks/current-order/actions.ts";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import {
    selectOrdersPage,
    selectOrdersRowsPerPage,
    selectOrdersSort,
    selectSortedOrders,
    setPage,
    setRowsPerPage,
    setSort
} from "@/ducks/orders/openOrdersSlice.ts";
import {orderListFields} from "@/components/orders-list/OrderListFields.tsx";


const rowClassName = (row: ShopifyOrderRow) => {
    return classNames({
        'text-danger': row.import_status === 'failed',
        'text-success': !!row.InvoiceNo,
    })
}

const OrdersList = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedOrders);
    const page = useAppSelector(selectOrdersPage);
    const rowsPerPage = useAppSelector(selectOrdersRowsPerPage);
    const sort = useAppSelector(selectOrdersSort);
    const current = useAppSelector(selectCurrentOrder);

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
            <SortableTable fields={orderListFields} currentSort={sort} size="sm"
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
