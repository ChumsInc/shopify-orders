import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {DateInput} from "chums-components";
import {selectCreatedAtMax, selectCreatedAtMin} from "./selectors";
import {setCreatedMax} from "./actions";


export default function OrdersFilterToDate() {
    const dispatch = useAppDispatch();
    const minDate = useSelector(selectCreatedAtMin);
    const maxDate = useSelector(selectCreatedAtMax);

    const changeHandler = (date: Date | null) => {
        dispatch(setCreatedMax(date))
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">To</div>
            <DateInput date={maxDate} required onChangeDate={changeHandler} disabled={!minDate}/>
        </div>
    )
}
