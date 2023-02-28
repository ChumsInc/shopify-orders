export const now = () => new Date().valueOf();
export const noop = () => {};

export function parseOptions(options = {}) {
    return Object.keys(options)
        .filter(key => !!options[key])
        .map(key => {
            const val = encodeURIComponent(options[key]);
            return `${key}=${val}`;
        })
        .join('&');
}
