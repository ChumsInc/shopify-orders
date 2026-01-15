export interface ImportStatusIconProps {
    import_status: string
}
export default function ImportStatusIcon({import_status}: ImportStatusIconProps) {
    const icon = importStatusIcon(import_status);
    if (!icon) {
        return (<span>{import_status}</span>);
    }
    return (<span className={`bi-${icon}`}/>);
}

function importStatusIcon(import_status: string): string | null {
    switch (import_status) {
        case 'successful':
            return 'check-lg';
        case 'failed':
            return 'bug';
        case 'linked':
            return 'link';
        case 'importing':
            return 'hourglass-split';
        case 'waiting':
            return 'stopwatch'
        case 'require-validation':
            return 'exclamation-diamond-fill';
        case 'pending':
            return 'gear-fill'
        default:
            return null;
    }
}
