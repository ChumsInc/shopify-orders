import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {SortProps} from "chums-types";
import type {RootState} from "@/app/configureStore";
import {fetchOrders} from "../../api";
import type {FilterOrderStatus, ShopifyOrderRow} from "../types";
import {selectFetchOptions, selectLoading, selectNextPendingFulfillment} from "./selectors";
import {fulfillOrder} from "../current-order/actions";

export const loadOrders = createAsyncThunk<ShopifyOrderRow[], void, {state:RootState}>(
    'orders/list/load',
    async (_, {getState}) => {
        const state = getState()
        const options = selectFetchOptions(state);
        return await fetchOrders(options);
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return !selectLoading(state);
        }
    }
)


export const fulfillAllOrders = createAsyncThunk<void, void, {state:RootState}>(
    'orders/fulfillAll',
    async (_, {getState, dispatch}) => {
        const state = getState();
        const keys = selectNextPendingFulfillment(state)
        for await (const key of keys) {
            await dispatch(fulfillOrder(key));
        }
    }
);

export const setFilterStatus = createAction<FilterOrderStatus>('orders/setStatus');
export const setCreatedMin = createAction<string | null>('orders/setCreatedMin');
export const setCreatedMax = createAction<string | null>('orders/setCreatedMax');
export const setPage = createAction<number>('orders/setPage');
export const setRowsPerPage = createAction<number>('orders/setRowsPerPage');
export const setSort = createAction<SortProps<ShopifyOrderRow>>('orders/setSort');

