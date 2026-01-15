import {createEntityAdapter, createSlice, isRejected, type PayloadAction} from "@reduxjs/toolkit";
import type {Variant} from "react-bootstrap/esm/types";

export interface ErrorAlert {
    id: number;
    context: string;
    message: string;
    count: number;
    variant?: Variant;
}

const adapter = createEntityAdapter<ErrorAlert, number>({
    selectId: alert => alert.id,
    sortComparer: (a, b) => b.id - a.id
})

export interface AlertsState {
    nextId: number;
}

export const initialAlertsState: AlertsState = {
    nextId: 0,
}


const selectors = adapter.getSelectors();
const alertsSlice = createSlice({
    name: 'alerts',
    initialState: adapter.getInitialState(initialAlertsState),
    reducers: {
        dismissAlert: (state, action: PayloadAction<ErrorAlert>) => {
            adapter.removeOne(state, action.payload.id);
        },
        addAlert: (state, action: PayloadAction<Omit<ErrorAlert, 'id' | 'count'>>) => {
            if (action.payload.context) {
                const alert = selectors.selectAll(state).find(alert => alert.context === action.payload.context);
                if (alert) {
                    alert.count += 1;
                    adapter.setOne(state, alert);
                    return;
                }
            }
            adapter.addOne(state, {id: state.nextId, count: 1, ...action.payload});
            state.nextId += 1;
        }
    },
    extraReducers: builder => {
        builder
            .addDefaultCase((state, action) => {
                if (isRejected(action) && action.error) {
                    const context = action.type.replace('/rejected', '');
                    const alert = selectors.selectAll(state).find(alert => alert.context === context);
                    if (alert) {
                        alert.count += 1;
                        adapter.setOne(state, alert);
                        return;
                    }
                    adapter.addOne(state, {
                        id: state.nextId,
                        count: 1,
                        context,
                        variant: "danger",
                        message: action.error.message ?? ''
                    });
                    state.nextId += 1;
                }
            })
    },
    selectors: {
        selectAlerts: (state) => selectors.selectAll(state),
    }
})

export default alertsSlice;
export const {addAlert, dismissAlert} = alertsSlice.actions;
export const {selectAlerts} = alertsSlice.selectors
