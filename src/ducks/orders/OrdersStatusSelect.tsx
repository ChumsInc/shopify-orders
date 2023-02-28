import React, {ChangeEvent} from 'react';
import {FilterOrderStatus} from "../types";
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectFilterStatus} from "./selectors";
import {setFilterStatus} from "./actions";


export default function OrderStatusSelect() {
    const dispatch = useAppDispatch();
    const status = useSelector(selectFilterStatus);
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilterStatus(ev.target.value as FilterOrderStatus))
    }
    return (
        <select className="form-select form-select-sm" value={status} onChange={changeHandler}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
            <option value="any">Any</option>
        </select>
    )
}
