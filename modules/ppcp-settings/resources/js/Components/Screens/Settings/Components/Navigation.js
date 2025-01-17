import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import TopNavigation from '../../../ReusableComponents/TopNavigation';
import { StylingHooks } from '../../../../data';

const SettingsNavigation = () => {
	const { persist: persistStyling } = StylingHooks.useStore();
	const isBusy = false; // TODO: Implement loading state.

	const handleSaveClick = () => {
		persistStyling();
	};

	const title = __( 'PayPal Payments', 'woocommerce-paypal-payments' );

	return (
		<TopNavigation title={ title } exitOnTitleClick={ true }>
			<Button
				variant="primary"
				disabled={ isBusy }
				onClick={ handleSaveClick }
			>
				{ __( 'Save', 'woocommerce-paypal-payments' ) }
			</Button>
		</TopNavigation>
	);
};

export default SettingsNavigation;
