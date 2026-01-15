import type {ChangeEvent} from 'react';
import type {FilterOrderStatus} from "@/ducks/types.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectFilterStatus} from "@/ducks/orders/selectors.ts";
import {setFilterStatus} from "@/ducks/orders/actions.ts";


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
