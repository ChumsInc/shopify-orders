import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppDispatch} from "../../app/configureStore";
import {selectCurrentOrder} from "./selectors";
import {linkOrder} from "./actions";

const LinkSalesOrder = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCurrentOrder)
    const [salesOrderNo, setSalesOrderNo] = useState('');

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setSalesOrderNo(ev.target.value)
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (current?.id) {
            dispatch(linkOrder({id: current?.id, salesOrderNo}))
        }
    }

    return (
        <form className="input-group input-group-sm" onSubmit={onSubmit}>
            <div className="input-group-text">Sales Order #</div>
            <input type="text" pattern="/[\dA-Z]{7}/"
                   value={salesOrderNo}
                   onChange={onChange}/>
            <button type="submit" className="btn btn-sm btn-primary">Link Order</button>
        </form>
    );
}

export default LinkSalesOrder;
