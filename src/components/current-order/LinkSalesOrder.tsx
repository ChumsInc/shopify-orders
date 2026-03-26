import {type ChangeEvent, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import {linkOrder} from "@/ducks/current-order/actions.ts";

const LinkSalesOrder = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentOrder)
    const [salesOrderNo, setSalesOrderNo] = useState('');

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setSalesOrderNo(ev.target.value)
    }

    const onSubmit = () => {
        if (current?.id) {
            dispatch(linkOrder({id: current?.id, salesOrderNo}))
        }
    }

    return (
        <form className="input-group input-group-sm mb-3" action={onSubmit}>
            <div className="input-group-text">Sales Order #</div>
            <input type="text" pattern="/[\dA-Z]{7}/" className="form-control"
                   value={salesOrderNo}
                   onChange={onChange}/>
            <button type="submit" className="btn btn-sm btn-primary">Link Order</button>
        </form>
    );
}

export default LinkSalesOrder;
