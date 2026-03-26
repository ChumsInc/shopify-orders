import type {SageImportError, SageImportResponseV2} from "@/ducks/types.ts";

export const now = () => new Date().valueOf();
export const noop = () => {};

export const rowsPerPageKey = 'chums:shopify-orders:rows-per-page';

export function isSageImportResponse(response: SageImportResponseV2|SageImportError): response is SageImportResponseV2 {
    return (response as SageImportResponseV2).success !== undefined;
}
