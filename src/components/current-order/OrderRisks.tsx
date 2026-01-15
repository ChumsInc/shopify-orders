import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";
import {loadRiskSummary} from "@/ducks/current-order/actions.ts";
import LegacyRiskTable from "./LegacyRiskTable.tsx";
import RiskSummary from "./RiskSummary.tsx";

export default function OrderRisks(){
    const dispatch = useAppDispatch();
    const order = useSelector(selectCurrentOrder);

    const clickHandler = () => {
        if (!order) {
            return;
        }
        dispatch(loadRiskSummary(order.sage_SalesOrderNo))
    }
    if (!order || !order.shopify_order) {
        return null;
    }

    return (
        <>
            <div className="row g-3 mt-1">
                <div className="col-auto">
                    <h5>Risks</h5>
                </div>
                <div className="col"></div>
                <div className="col-auto">
                    <button type="button" onClick={clickHandler}
                            className="btn btn-sm btn-outline-secondary">
                        Update Risks
                    </button>
                </div>
            </div>
            <RiskSummary/>
            <LegacyRiskTable/>
        </>
    )
}
