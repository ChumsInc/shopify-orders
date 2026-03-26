import Badge from "react-bootstrap/esm/Badge";
import {css, cx} from "@emotion/css";

export interface TagBadgeProps {
    tag: string;
}
export default function TagBadge({tag}:TagBadgeProps) {
    return (
        <Badge bg="light" text="primary" className={cx('border', css`--bs-badge-padding-y: calc(0.35em - 2px);`)}>
            <span className="bi-tag-fill me-1"/>
            {tag}
        </Badge>
    )
}
