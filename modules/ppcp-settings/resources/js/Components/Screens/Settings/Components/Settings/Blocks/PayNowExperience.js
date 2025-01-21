import { __ } from '@wordpress/i18n';
import { ToggleSettingsBlock } from '../../../../../ReusableComponents/SettingsBlocks';
import { SettingsHooks } from '../../../../../../data';

const PayNowExperience = () => {
	const { payNowExperience, setPayNowExperience } =
		SettingsHooks.useSettings();

	return (
		<ToggleSettingsBlock
			title={ __( 'Pay Now Experience', 'woocommerce-paypal-payments' ) }
			description={ __(
				'Let PayPal customers skip the Order Review page by selecting shipping options directly within PayPal.',
				'woocommerce-paypal-payments'
			) }
			actionProps={ {
				key: 'payNowExperience',
				callback: setPayNowExperience,
				value: payNowExperience,
			} }
		/>
	);
};

export default PayNowExperience;
