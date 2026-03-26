import {businessDayjs} from "@/utils/date-utils.ts";
import {now} from "@/utils/utils.ts";
import Badge from "react-bootstrap/esm/Badge";
import type {Variant} from "react-bootstrap/esm/types";
import {css, cx} from "@emotion/css";

export interface DaysBadgeProps {
    createdAt: string;
}

export default function DaysBadge({createdAt}: DaysBadgeProps) {
    const days = businessDayjs(createdAt).businessDaysDiff(businessDayjs(now()))
    if (days <= 1) {
        return null;
    }
    const className = cx('border d-inline-flex align-items-center',
        css`
            --bs-badge-padding-y: calc(0.35em - 2px);
        `,
        {
            'text-dark': days < 4,
            'border-danger': days > 4,
        }
    )
    return (
        <Badge bg={daysVariant(days)} className={className}>
            <span className="bi-calendar-range-fill me-1"/>{days}
        </Badge>
    )
}

function daysVariant(days: number): Variant {
    if (days > 4) {
        return 'danger';
    } else if (days > 2) {
        return 'warning';
    }
    return 'light';
}
