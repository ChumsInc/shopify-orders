import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ExtendedSavedOrder, SortProps} from "chums-types";
import {RootState} from "../../app/configureStore";
import {fetchOrders} from "../../api";
import {FilterOrderStatus, ShopifyOrderRow} from "../types";
import {selectFetchOptions, selectLoading, selectNextPendingFulfillment} from "./selectors";
import {fulfillOrder} from "../current-order/actions";

export const loadOrders = createAsyncThunk<ShopifyOrderRow[]>(
    'orders/list/load',
    async (arg, {getState}) => {
        const state = getState() as RootState
        const options = selectFetchOptions(state);
        return await fetchOrders(options);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)


export const fulfillAllOrders = createAsyncThunk(
    'orders/fulfillAll',
    async (arg, {getState, dispatch}) => {
        const state = getState() as RootState;
        const keys = selectNextPendingFulfillment(state)
        for await (const key of keys) {
            await dispatch(fulfillOrder(key));
        }
    }
);

export const setFilterStatus = createAction<FilterOrderStatus>('orders/setStatus');
export const setCreatedMin = createAction<Date|null>('orders/setCreatedMin');
export const setCreatedMax = createAction<Date|null>('orders/setCreatedMax');
export const setPage = createAction<number>('orders/setPage');
export const setRowsPerPage = createAction<number>('orders/setRowsPerPage');
export const setSort = createAction<SortProps<ShopifyOrderRow>>('orders/setSort');

