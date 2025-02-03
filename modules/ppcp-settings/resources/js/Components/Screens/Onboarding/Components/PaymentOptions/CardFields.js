import { __ } from '@wordpress/i18n';

import PricingTitleBadge from '../../../../ReusableComponents/PricingTitleBadge';
import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const CardFields = () => (
	<BadgeBox
		title={ __( 'Custom Card Fields', 'woocommerce-paypal-payments' ) }
		imageBadge={ [
			'icon-button-visa.svg',
			'icon-button-mastercard.svg',
			'icon-button-amex.svg',
			'icon-button-discover.svg',
		] }
		textBadge={ <PricingTitleBadge item="ccf" /> }
		description={ __(
			'Style the credit card fields to match your own style. Includes advanced processing with risk management, 3D Secure, fraud protection options, and chargeback protection.',
			'woocommerce-paypal-payments'
		) }
		learnMoreLink={
			'https://www.paypal.com/us/business/paypal-business-fees'
		}
	/>
);

export default CardFields;
