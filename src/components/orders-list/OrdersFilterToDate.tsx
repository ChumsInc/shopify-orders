import type {ChangeEvent} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCreatedAtMax, selectCreatedAtMin} from "@/ducks/orders/selectors.ts";
import {setCreatedMax} from "@/ducks/orders/actions.ts";
import FormControl from "react-bootstrap/FormControl";


export default function OrdersFilterToDate() {
    const dispatch = useAppDispatch();
    const minDate = useSelector(selectCreatedAtMin);
    const maxDate = useSelector(selectCreatedAtMax);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setCreatedMax(ev.target.value))
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">To</div>
            <FormControl type="date" size="sm" value={maxDate ?? ''} required onChange={changeHandler}
                         disabled={!minDate}/>
        </div>
    )
}
