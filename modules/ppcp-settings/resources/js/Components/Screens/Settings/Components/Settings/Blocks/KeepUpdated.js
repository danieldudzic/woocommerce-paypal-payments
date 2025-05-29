import { __ } from '@wordpress/i18n';

import { ControlToggleButton } from '../../../../../ReusableComponents/Controls';
import { SettingsHooks } from '../../../../../../data';
import SettingsBlock from '../../../../../ReusableComponents/SettingsBlock';

const KeepUpdated = () => {
	const { keepUpdated, setKeepUpdated } = SettingsHooks.useSettings();

	return (
		<SettingsBlock className="ppcp--pay-now-experience">
			<ControlToggleButton
				label={ __(
					'Keep updated with PayPal',
					'woocommerce-paypal-payments'
				) }
				description={ __(
					'Receive updates on PayPal features, promotions, and news.',
					'woocommerce-paypal-payments'
				) }
				onChange={ setKeepUpdated }
				value={ keepUpdated }
			/>
		</SettingsBlock>
	);
};

export default KeepUpdated;
