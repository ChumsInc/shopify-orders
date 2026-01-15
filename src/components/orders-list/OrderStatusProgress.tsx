import {useSelector} from 'react-redux';
import classNames from 'classnames';
import {selectLoading, selectOrderAges} from "@/ducks/orders/selectors.ts";
import ProgressBar from "react-bootstrap/ProgressBar";
import type {Variant} from "react-bootstrap/esm/types";
import {useAppSelector} from "@/app/configureStore.ts";


function progressClassName(days: number): Variant {
    return classNames({
        'transparent': days < 1,
        // 'light': days = 1,
        'success': days >= 1 && days < 2,
        'info': days >= 2 && days < 3,
        'warning': days >= 3 && days < 5,
        'danger': days >= 5
    }) as Variant
}

const OrderStatusProgress = () => {
    const ages = useSelector(selectOrderAges);
    const loading = useAppSelector(selectLoading);
    const total: number = Object.values(ages).reduce((pv: number, cv: number) => +pv + +cv, 0);

    return (
        <ProgressBar style={{minWidth: '20rem', width: '100%', height: '1rem'}}>
            {loading && <ProgressBar striped animated now={100} label="Loading..."/>}
            {!loading && Object.keys(ages).map(age => (
                    <ProgressBar key={age} min={0} max={total} now={ages[+age] ?? 0} variant={progressClassName(+age)}
                                 className={classNames({'text-body-emphasis': +age === 0})} label={`${ages[+age]}@${age}`}/>
                )
            )}
        </ProgressBar>
    )
}
export default OrderStatusProgress;
