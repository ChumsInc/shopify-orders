import React from "react";

const importStatusIcon = (import_status: string): string | null => {
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
        default:
            return null;
    }
}

const ImportStatusIcon = ({import_status}: { import_status: string }) => {
    const icon = importStatusIcon(import_status);
    if (!icon) {
        return (<span>{import_status}</span>);
    }
    return (<span className={`bi-${icon}`}/>);
}
export default ImportStatusIcon;
