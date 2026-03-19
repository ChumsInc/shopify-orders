import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ExtendedSavedOrder} from "chums-types";
import type {RootState} from "@/app/configureStore";
import {fetchOrders} from "../../api";
import {fulfillOrder} from "../current-order/actions";
import {selectNextPendingFulfillment} from "@/ducks/orders/fulfillmentStatusSlice.ts";
import {selectOrdersStatus} from "@/ducks/orders/openOrdersSlice.ts";

export const loadOrders = createAsyncThunk<ExtendedSavedOrder[], void, { state: RootState }>(
    'orders/list/load',
    async () => {
        return await fetchOrders();
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return selectOrdersStatus(state) === 'idle';
        }
    }
)


export const fulfillAllOrders = createAsyncThunk<void, void, { state: RootState }>(
    'orders/fulfillAll',
    async (_, {getState, dispatch}) => {
        const state = getState();
        const orders = selectNextPendingFulfillment(state)
        for await (const order of orders) {
            await dispatch(fulfillOrder(order.id));
        }
    }
);


