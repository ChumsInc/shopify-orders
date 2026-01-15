const reLocal = /^local/;
const sessionStoragePrefix:string = 'session/shopify-orders';
const localStoragePrefix:string = 'local/shopify-orders';


export const sessionStorageKeys = {
    fromDate: `${sessionStoragePrefix}/from-date`,
    toDate: `${sessionStoragePrefix}/to-date`,
};

export const localStorageKeys = {
    rowsPerPage: `${localStoragePrefix}/rowsPerPage`,
}
function getStorage(key:string):Storage {
    return reLocal.test(key) ? window.localStorage : window.sessionStorage;
}

function canUseStorage() {
    return typeof window !== 'undefined' && window.localStorage && window.sessionStorage;
}

export const setPreference = (key:string, value:any) => {
    try {
        if (!canUseStorage()) {
            return;
        }
        getStorage(key).setItem(key, JSON.stringify(value));
    } catch(err:any) {
        console.log("setPreference()", err.message);
    }
};

export const clearPreference = (key:string) => {
    if (!canUseStorage()) {
        return;
    }
    getStorage(key).removeItem(key);
}

export const getPreference = (key:string, defaultValue: any) => {
    try {
        if (!canUseStorage()) {
            return defaultValue;
        }
        const value = getStorage(key).getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value);
    } catch(err:any) {
        console.log("getPreference()", err.message);
        return defaultValue;
    }
};
