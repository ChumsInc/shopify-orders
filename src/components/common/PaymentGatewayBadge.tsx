import Badge from "react-bootstrap/esm/Badge";
import classNames from "classnames";

function PaymentGatewayIcon({gateway}: { gateway: string }) {
    switch (gateway) {
        case 'paypal':
            return <span className="bi-paypal"/>;
        case 'shopify_payments':
            return <span>SP</span>;
        case 'shop_cash':
            return <span>Shop Cash</span>;
        default:
            return <span>{gateway}</span>
    }
}

export default function PaymentGatewayBadge({gateway}: { gateway: string }) {
    const className = classNames("border rounded border-secondary p-1 bg-light", {
        'text-dark': gateway.includes('paypal') || gateway.includes('shopify_payments'),
        'text-danger': !(gateway.includes('paypal') || gateway.includes('shopify_payments')),
    });
    return (
        <Badge className={className}>
            <span className="bi-currency-dollar me-1" />
            <PaymentGatewayIcon gateway={gateway}/>
        </Badge>
    )
}

