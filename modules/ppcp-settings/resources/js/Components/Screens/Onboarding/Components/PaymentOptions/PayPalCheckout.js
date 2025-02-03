import { __ } from '@wordpress/i18n';

import PricingTitleBadge from '../../../../ReusableComponents/PricingTitleBadge';
import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const PayPalCheckout = () => (
	<BadgeBox
		title={ __( 'PayPal Checkout', 'woocommerce-paypal-payments' ) }
		textBadge={ <PricingTitleBadge item="checkout" /> }
		description={ __(
			'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximise conversion',
			'woocommerce-paypal-payments'
		) }
	/>
);

export default PayPalCheckout;
