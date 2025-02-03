import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const PayWithPayPal = () => (
	<BadgeBox
		title={ __( 'Pay with PayPal', 'woocommerce-paypal-payments' ) }
		imageBadge={ [ 'icon-button-paypal.svg' ] }
		description={ __(
			'Our brand recognition helps give customers the confidence to buy.',
			'woocommerce-paypal-payments'
		) }
		learnMoreLink={
			'https://www.paypal.com/us/business/paypal-business-fees'
		}
	/>
);

export default PayWithPayPal;
