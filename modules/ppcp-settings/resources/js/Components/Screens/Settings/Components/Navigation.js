import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import TopNavigation from '../../../ReusableComponents/TopNavigation';

const SettingsNavigation = () => {
	const title = __( 'PayPal Payments', 'woocommerce-paypal-payments' );

	return (
		<TopNavigation title={ title } exitOnTitleClick={ true }>
			<Button variant="primary" disabled={ false }>
				{ __( 'Save', 'woocommerce-paypal-payments' ) }
			</Button>
		</TopNavigation>
	);
};

export default SettingsNavigation;
