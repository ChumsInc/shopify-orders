import React from 'react';
import {Badge, BootstrapBGColor, SpinnerButton} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import ImportStatusIcon from "./ImportStatusIcon";

import {useSelector} from "react-redux";
import {selectImporting} from "./selectors";
import {importOrder} from "../current-order/actions";


const calcBadgeColor = (status: string): BootstrapBGColor => {
    switch (status) {
    case 'successful':
        return 'success';
    case 'linked':
        return 'info';
    case 'failed':
        return 'danger';
    case 'waiting':
    case 'importing':
        return 'warning';
    default:
        return 'secondary';
    }
}

const OrderImportButton = ({id, import_status}: { id: number | string | null, import_status: string }) => {
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

    const badgeColor = calcBadgeColor(import_status);
    return (
        <>
            {!!import_status && (
                <Badge color={badgeColor}><ImportStatusIcon import_status={import_status}/></Badge>
            )}
            {(!import_status || import_status === 'failed') && (
                <SpinnerButton type="button" color="primary" size="sm"
                               className="ms-1"
                               spinning={!!importing}
                               disabled={import_status === 'successful'}
                               onClick={importHandler}>
                    {!import_status ? 'Import' : 'Retry Import'}
                </SpinnerButton>
            )}
        </>
    );
}

export default OrderImportButton;
