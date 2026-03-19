import {createSelector} from "@reduxjs/toolkit";
import {selectCurrentOrder} from "@/ducks/current-order";
import {selectAllFulfillments} from "@/ducks/orders/fulfillmentStatusSlice.ts";

export const selectCurrentFulfillment = createSelector(
    [selectAllFulfillments, selectCurrentOrder],
    (list, current) => {
        return list.find(order => order.id === `${current?.id}`) ?? null
    }
)
