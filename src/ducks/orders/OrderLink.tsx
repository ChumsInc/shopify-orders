import React, {LinkHTMLAttributes} from 'react';

export interface OrderLinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    order_id: number | string;
    children?: React.ReactNode
}

const OrderLink = ({order_id, children, ...rest}: OrderLinkProps) => {
    const url = `https://chumsinc.myshopify.com/admin/orders/${encodeURIComponent(order_id)}`;
    return (<a href={url} {...rest} target="_blank">{children}</a>)
};

export default OrderLink;
