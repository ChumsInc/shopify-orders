import React from 'react';
import {ShopifyAddress} from "chums-types/src/shopify/shopify-orders";

const DeliveryAddress = ({address}: { address?: ShopifyAddress }) => {
    if (!address) {
        return null;
    }
    return (
        <div>
            <span className="me-1">{address.city},</span>
            <strong className="me-1">
                {address.province_code},
            </strong>
            {address.country_code !== 'US' && <strong className="me-1">{address.country_code}</strong>}
            <small className="me-1">{address.zip}</small>
        </div>
    )
}
export default DeliveryAddress
