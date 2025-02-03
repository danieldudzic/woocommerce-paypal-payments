import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const Crypto = () => (
	<BadgeBox
		title={ __( 'Crypto', 'woocommerce-paypal-payments' ) }
		imageBadge={ [ 'icon-payment-method-crypto.svg' ] }
		description={ __(
			'Let customers checkout with Crypto while you get paid in cash.',
			'woocommerce-paypal-payments'
		) }
		learnMoreLink={
			'https://www.paypal.com/us/business/paypal-business-fees'
		}
	/>
);

export default Crypto;
