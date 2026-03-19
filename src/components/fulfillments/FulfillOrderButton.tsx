import type {OrderDisplayFulfillmentStatus} from "chums-types/shopify-graphql";
import {useAppDispatch} from "@/app/configureStore.ts";
import {fulfillOrder} from "@/ducks/current-order/actions.ts";
import {Button, type ButtonProps} from "react-bootstrap";

export interface FulfillOrderButtonProps extends ButtonProps {
    orderId: string | number;
    status: OrderDisplayFulfillmentStatus | null;
    disabled?: boolean;
}

export default function FulfillOrderButton({orderId, status, ...rest}: FulfillOrderButtonProps) {
    const dispatch = useAppDispatch();
    const _disabled = rest.disabled || status === 'PENDING_FULFILLMENT' || status === 'IN_PROGRESS' || status === 'FULFILLED' || !status;

    const clickHandler = () => {
        dispatch(fulfillOrder(orderId));
    }

    return (
        <Button type="button" onClick={clickHandler} variant={statusVariant(status)} disabled={_disabled}
                {...rest}>
            Fulfill Order
        </Button>
    )
}

function statusVariant(status: OrderDisplayFulfillmentStatus | null) {
    switch (status) {
        case 'FULFILLED':
            return 'success';
        case 'REQUEST_DECLINED':
            return 'outline-danger';
        case 'OPEN':
            return 'outline-secondary';
        case 'PENDING_FULFILLMENT':
        case 'IN_PROGRESS':
            return 'outline-secondary';
        default:
            return 'outline-secondary'
    }
}
