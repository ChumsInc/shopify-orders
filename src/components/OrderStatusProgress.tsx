import React from 'react';
import {useSelector} from 'react-redux';
import classNames from 'classnames';
import {BootstrapColor, Progress, ProgressBar} from "chums-components";
import {selectOrderAges} from "../ducks/orders/selectors";


function progressClassName(days: number): BootstrapColor {
    return classNames({
        'transparent': days < 1,
        'light': days < 1,
        'success': days >= 1 && days < 2,
        'info': days >= 2 && days < 3,
        'warning': days >= 3 && days < 5,
        'danger': days >= 5
    }) as BootstrapColor
}

const OrderStatusProgress = () => {
    const ages = useSelector(selectOrderAges);
    const total: number = Object.values(ages).reduce((pv: number, cv: number) => +pv + +cv, 0);

    return (
        <Progress style={{minWidth: '20rem', width: '100%', height: '1rem'}}>
            {Object.keys(ages).map(age => (
                <ProgressBar key={age} valueMin={0} valueMax={total} value={ages[+age]} color={progressClassName(+age)}
                             className={classNames({'text-dark': +age === 0})}>{ages[+age]}@{age}</ProgressBar>
            ))}
        </Progress>
    )
}
export default OrderStatusProgress;
