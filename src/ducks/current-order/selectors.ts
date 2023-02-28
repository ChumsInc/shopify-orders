import {RootState} from "../../app/configureStore";

export const selectCurrentOrder = (state: RootState) => state.currentOrder.order;
export const selectLoading = (state: RootState) => state.currentOrder.loading;
export const selectSaving = (state: RootState) => state.currentOrder.saving;
