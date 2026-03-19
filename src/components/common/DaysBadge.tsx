import {businessDayjs} from "@/utils/date-utils.ts";
import {now} from "@/utils/utils.ts";
import classNames from "classnames";
import Badge from "react-bootstrap/esm/Badge";
import type {Variant} from "react-bootstrap/esm/types";


export interface DaysBadgeProps {
    createdAt: string;
}

export default function DaysBadge({createdAt}: DaysBadgeProps) {
    const days = businessDayjs(createdAt).businessDaysDiff(businessDayjs(now()))
    if (days <= 1) {
        return null;
    }
    const className = classNames('border', {
        'text-dark': days < 3,
        'border-dark': days < 3,
    })
    return (
        <Badge bg={daysVariant(days)} className={className}>
            <span className="bi-calendar-range-fill me-1" />{days}
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
