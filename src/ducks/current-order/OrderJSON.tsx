import {FormCheck} from "chums-components";
import {JSONView} from "json-view";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentOrder} from "./selectors";

export default function OrderJSON() {
    const [open, setOpen] = useState<boolean>(false);
    const order = useSelector(selectCurrentOrder);

    return (
        <div>
            <FormCheck type="checkbox" label="Show Import Detail" checked={open} onChange={(ev) => setOpen(ev.target.checked)} />
            {open && (
                <JSONView data={order} defaultOpenLevels={2} />
            )}
        </div>
    )
}
