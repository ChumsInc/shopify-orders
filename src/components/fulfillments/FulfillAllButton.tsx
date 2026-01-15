import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectFulfillmentsList} from "@/ducks/orders/selectors.ts";
import {fulfillAllOrders} from "@/ducks/orders/actions.ts";

export default function FulfillAllButton(){
    const dispatch = useAppDispatch();
    const fulfillmentList = useSelector(selectFulfillmentsList);
    const hasPending = Object.values(fulfillmentList).filter(value => value === 'pending').length > 0;
    const hasInvoiced = Object.values(fulfillmentList).filter(value => value === 'invoiced').length;
    const isSending = Object.values(fulfillmentList).filter(value => value === 'sending').length > 0;
    const countToFulfill = Object.values(fulfillmentList).filter(value => value === 'pending' || value === 'invoiced').length;

    const clickHandler = () => {
        dispatch(fulfillAllOrders());
    }
    return (
        <button type="button" className="btn btn-sm btn-outline-success" disabled={hasPending || isSending || hasInvoiced === 0}
            onClick={clickHandler}>
            Fulfill All Orders ({countToFulfill})
        </button>
    )
}
