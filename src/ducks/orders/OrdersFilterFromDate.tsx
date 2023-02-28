import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";

import {DateInput} from "chums-components";
import {selectCreatedAtMin} from "./selectors";
import {setCreatedMin} from "./actions";


export default function OrdersFilterFromDate() {
    const dispatch = useAppDispatch();
    const minDate = useSelector(selectCreatedAtMin);

    const changeHandler = (date: Date | null) => {
        dispatch(setCreatedMin(date))
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">From</div>
            <DateInput date={minDate ?? ''} required onChangeDate={changeHandler}/>
        </div>
    )
}
