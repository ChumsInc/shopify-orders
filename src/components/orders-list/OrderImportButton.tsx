import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectImporting} from "@/ducks/orders/selectors.ts";
import {importOrder} from "@/ducks/current-order/actions.ts";
import {Button, Spinner} from "react-bootstrap";


export interface OrderImportButtonProps {
    id: number | string | null,
    import_status: string,
}

export default function OrderImportButton({id, import_status}: OrderImportButtonProps) {
    const dispatch = useAppDispatch();
    const importing = useSelector(selectImporting);

    const importHandler = () => {
        if (!id || import_status === 'successful') {
            return;
        }
        dispatch(importOrder({id, retry: import_status === 'failed'}));
    }

    if (!id) {
        return null
    }

    return (
        <Button type="button" variant="primary" size="sm"
                className="ms-1"
                disabled={import_status === 'successful' || !!importing}
                onClick={importHandler}>
            {!!importing && (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1"/>)}
            {!import_status ? 'Import' : 'Retry Import'}
        </Button>
    );
}
