import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { CommonHooks, StylingHooks } from '../../../../data';
import TopNavigation from '../../../ReusableComponents/TopNavigation';
import BusyStateWrapper from '../../../ReusableComponents/BusyStateWrapper';

const SettingsNavigation = () => {
	const { withActivity } = CommonHooks.useBusyState();

	// Todo: Implement other stores here.
	const { persist: persistStyling } = StylingHooks.useStore();

	const handleSaveClick = () => {
		// Todo: Add other stores here.
		withActivity(
			'persist-styling',
			'Save styling details',
			persistStyling
		);
	};

	const title = __( 'PayPal Payments', 'woocommerce-paypal-payments' );

	return (
		<TopNavigation title={ title } exitOnTitleClick={ true }>
			<BusyStateWrapper>
				<Button variant="primary" onClick={ handleSaveClick }>
					{ __( 'Save', 'woocommerce-paypal-payments' ) }
				</Button>
			</BusyStateWrapper>
		</TopNavigation>
	);
};

export default SettingsNavigation;
