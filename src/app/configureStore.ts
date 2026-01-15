import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import alertsSlice from "../ducks/alerts";
import ordersReducer from "../ducks/orders";
import currentOrderSlice from "../ducks/current-order";


const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    orders: ordersReducer,
    [currentOrderSlice.reducerPath]: currentOrderSlice.reducer,
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
