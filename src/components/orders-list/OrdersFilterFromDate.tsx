import type {ChangeEvent} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCreatedAtMin} from "@/ducks/orders/selectors.ts";
import {setCreatedMin} from "@/ducks/orders/actions.ts";
import FormControl from "react-bootstrap/FormControl";


export default function OrdersFilterFromDate() {
    const dispatch = useAppDispatch();
    const minDate = useSelector(selectCreatedAtMin);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setCreatedMin(ev.target.value))
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">From</div>
            <FormControl type="date" value={minDate ?? ''} required onChange={changeHandler}/>
        </div>
    )
}
