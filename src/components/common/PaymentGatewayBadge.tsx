import Badge from "react-bootstrap/esm/Badge";
import {css, cx} from "@emotion/css";



const paymentBadge = css`
    background-size: contain;
    background-repeat: no-repeat;
    min-width: 12px;
    min-height: 12px;
`


function PaymentGatewayIcon({gateway, className}: { gateway: string, className?: string }) {
    switch (gateway) {
        case 'paypal':
            return <span className={cx("bi-paypal", className)} title="PayPal"/>;
        case 'shopify_payments':
            return <span className={cx("bi", paymentBadge, 'shopify-pay')} title="Shopify Payments"/>;
        case 'shop_cash':
            return <span className={cx("bi", paymentBadge, 'shopify-cash')} title="Shopify Cash"/>;
        default:
            return <span className={className}>{gateway}</span>
    }
}

export default function PaymentGatewayBadge({gateway}: { gateway: string }) {
    const borderStyle = css`--bs-badge-padding-y: calc(0.35em - 2px);`
    const className = cx("border d-inline-flex align-items-center",
        borderStyle,
        {
            'text-dark': gateway.includes('paypal') || gateway.includes('shopify_payments') || gateway.includes('shop_cash'),
            'text-danger': !(gateway.includes('paypal') || gateway.includes('shopify_payments')),
        });
    return (
        <Badge className={className} bg="light">
            <span className="bi-currency-dollar text-secondary me-1"/>
            <PaymentGatewayIcon gateway={gateway} className="me-1"/>
        </Badge>
    )
}

