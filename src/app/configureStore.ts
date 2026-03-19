import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import alertsSlice from "../ducks/alerts";
import currentOrderSlice from "../ducks/current-order";
import fulfillmentStatusSlice from "@/ducks/orders/fulfillmentStatusSlice.ts";
import openOrdersSlice from "@/ducks/orders/openOrdersSlice.ts";


const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [currentOrderSlice.reducerPath]: currentOrderSlice.reducer,
    [openOrdersSlice.reducerPath]: openOrdersSlice.reducer,
    [fulfillmentStatusSlice.reducerPath]: fulfillmentStatusSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: {
        name: 'Chums / Shopify Orders'
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
