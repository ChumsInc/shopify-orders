import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {fulfillAllOrders} from "@/ducks/orders/actions.ts";
import {selectAvailableFulfillments} from "@/ducks/orders/fulfillmentStatusSlice.ts";

export default function FulfillAllButton() {
    const dispatch = useAppDispatch();
    const fulfillmentList = useAppSelector(selectAvailableFulfillments);
    const invoicedCount = fulfillmentList.filter(order => !!order.invoiceNo).length;
    const sendingCount = fulfillmentList.filter(order => order.status === 'IN_PROGRESS').length;
    const countToFulfill = invoicedCount - sendingCount;

    const clickHandler = () => {
        dispatch(fulfillAllOrders());
    }
    return (
        <button type="button" className="btn btn-sm btn-outline-success"
                disabled={sendingCount > 0 || !invoicedCount}
                onClick={clickHandler}>
            Fulfill All Orders ({countToFulfill})
        </button>
    )
}
