import FulfillAllButton from "./FulfillAllButton.tsx";
import ProgressBar from "react-bootstrap/ProgressBar";
import {selectAvailableFulfillments} from "@/ducks/orders/fulfillmentStatusSlice.ts";
import FulfillmentListRow from "@/components/fulfillments/FulfillmentListRow.tsx";
import {useAppSelector} from "@/app/configureStore.ts";

export default function FulfillmentList() {
    const list = useAppSelector(selectAvailableFulfillments);
    const fulfilled = list.filter(order => order.status === 'FULFILLED').length;
    const pending = list.filter(order => order.status === 'PENDING_FULFILLMENT').length;
    const unfulfilled = list.filter(order => order.status === 'UNFULFILLED').length;


    if (!list.length) {
        return null;
    }

    return (
        <div>
            <FulfillAllButton/>
            <ProgressBar className="my-3">
                <ProgressBar now={fulfilled / list.length * 100} variant="success"/>
                <ProgressBar now={pending / list.length * 100} variant="info" striped animated/>
                <ProgressBar now={unfulfilled / list.length * 100} variant="light"/>
            </ProgressBar>
            <table className="table table-sm table-hover">
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {list.map(order => (
                    <FulfillmentListRow order={order} key={order.id}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}
