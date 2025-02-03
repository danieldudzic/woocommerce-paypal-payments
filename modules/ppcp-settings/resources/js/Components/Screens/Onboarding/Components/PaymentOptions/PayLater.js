import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const PayLater = () => (
	<BadgeBox
		title={ __( 'Pay Later', 'woocommerce-paypal-payments' ) }
		imageBadge={ [ 'icon-payment-method-paypal-small.svg' ] }
		description={ __(
			'Offer installment payment options and get paid upfront.',
			'woocommerce-paypal-payments'
		) }
		learnMoreLink={
			'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
		}
	/>
);

export default PayLater;
