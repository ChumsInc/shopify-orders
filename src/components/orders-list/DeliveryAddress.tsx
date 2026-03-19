import type {MailingAddress, Maybe} from "chums-types/shopify-graphql";

const DeliveryAddress = ({address}: { address?: Maybe<MailingAddress> }) => {
    if (!address) {
        return null;
    }
    return (
        <div>
            <span className="me-1">{address.city},</span>
            <strong className="me-1">
                {address.provinceCode},
            </strong>
            {address.countryCodeV2 !== 'US' && <strong className="me-1">{address.countryCodeV2}</strong>}
            <small className="me-1">{address.zip}</small>
        </div>
    )
}
export default DeliveryAddress
