import Badge from "react-bootstrap/Badge";
import ImportStatusIcon from "@/components/orders-list/ImportStatusIcon.tsx";
import type {Variant} from "react-bootstrap/esm/types";

export interface ImportStatusBadgeProps {
    status: string;
}
export default function ImportStatusBadge({status}: ImportStatusBadgeProps) {
    return (
        <Badge bg={calcBadgeColor(status)} title={status} text={badgeTextColor(status)}>
            <ImportStatusIcon import_status={status}/>
        </Badge>
    )
}


function calcBadgeColor(status: string): Variant {
    switch (status) {
        case 'successful':
            return 'success';
        case 'linked':
        case 'pending':
            return 'info';
        case 'failed':
            return 'danger';
        case 'require-validation':
            return 'warning';
        case 'waiting':
        case 'importing':
            return 'secondary';
        default:
            return 'secondary';
    }
}

function badgeTextColor(status: string): Variant {
    switch (status) {
        case 'linked':
        case 'pending':
            case 'require-validation':
            return 'dark';
        default:
            return 'light';
    }
}
