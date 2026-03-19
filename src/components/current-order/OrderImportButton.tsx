import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {importOrder} from "@/ducks/current-order/actions.ts";
import {Button, Spinner} from "react-bootstrap";
import {selectCurrentOrderStatus} from "@/ducks/current-order";
import {selectOrdersStatus} from "@/ducks/orders/openOrdersSlice.ts";


export interface OrderImportButtonProps {
    id: number | string | null,
    import_status: string,
}

export default function OrderImportButton({id, import_status}: OrderImportButtonProps) {
    const dispatch = useAppDispatch();
    const ordersStatus = useAppSelector(selectOrdersStatus);
    const status = useAppSelector(selectCurrentOrderStatus);

    const importHandler = () => {
        if (!id || import_status === 'successful') {
            return;
        }
        dispatch(importOrder({id, retry: import_status === 'failed'}));
    }

    if (!id) {
        return null
    }

    const disabled = ordersStatus === 'loading' || import_status === 'successful' || import_status === 'require-validation' || status !== 'idle';

    return (
        <Button type="button" variant="primary" size="sm"
                className="ms-1"
                disabled={disabled}
                onClick={importHandler}>
            {status === 'importing' && (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1"/>)}
            {!import_status ? 'Import' : 'Retry Import'}
        </Button>
    );
}
