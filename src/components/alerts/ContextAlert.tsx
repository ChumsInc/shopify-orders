import Alert, {type AlertProps} from "react-bootstrap/Alert";

export interface ContextAlertProps extends AlertProps {
    context?: string;
    count?: number;

}
export default function ContextAlert({context, count, variant, onClose, dismissible, children, ...rest}: ContextAlertProps) {
    return (
        <Alert variant={variant} onClose={onClose} dismissible {...rest}>
            <Alert.Heading>
                {context}
                {(count ?? 0) > 1 && <span className="ms-3">{count}</span>}
            </Alert.Heading>
            <p>{children}</p>
        </Alert>
    )
}
