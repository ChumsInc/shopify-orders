import FormCheck from "react-bootstrap/FormCheck";
import {JSONView} from "@chumsinc/json-view";
import {useId, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "@/ducks/current-order/index.ts";

export default function OrderJSON() {
    const [open, setOpen] = useState<boolean>(false);
    const order = useSelector(selectCurrentOrder);
    const id = useId();

    return (
        <div>
            <FormCheck id={id} type="checkbox" label="Show Import Detail" checked={open} onChange={(ev) => setOpen(ev.target.checked)} />
            {open && (
                <JSONView data={order} defaultOpenLevels={2} />
            )}
        </div>
    )
}
