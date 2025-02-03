import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const Venmo = () => (
	<BadgeBox
		title={ __( 'Venmo', 'woocommerce-paypal-payments' ) }
		imageBadge={ [ 'icon-button-venmo.svg' ] }
		description={ __(
			'Automatically offer Venmo checkout to millions of active users.',
			'woocommerce-paypal-payments'
		) }
		learnMoreLink={
			'https://www.paypal.com/us/business/paypal-business-fees'
		}
	/>
);

export default Venmo;
