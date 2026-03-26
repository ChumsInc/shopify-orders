import Badge from "react-bootstrap/esm/Badge";
import {css, cx} from "@emotion/css";

export interface SageOrderStatusBadgeProps {
    status: string;
}

export default function SageOrderStatusBadge({status}: SageOrderStatusBadgeProps) {
    return (
        <Badge bg="light"
               className={cx(
                   'border text-secondary',
                   {
                       'text-danger': status === 'H',
                       'text-primary': status === 'C',
                       // 'text-secondary': !['H', 'C'].includes(status),
                   },
                   css`--bs-badge-padding-y: calc(0.35em - 2px);`
               )}>
            <span className="bi">{status}</span>
        </Badge>
    )
}
