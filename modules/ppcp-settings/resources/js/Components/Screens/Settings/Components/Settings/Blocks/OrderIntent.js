import { __ } from '@wordpress/i18n';
import {
	Header,
	Title,
	Description,
} from '../../../../../ReusableComponents/Elements';
import { ToggleSettingsBlock } from '../../../../../ReusableComponents/SettingsBlocks';
import SettingsBlock from '../../../../../ReusableComponents/SettingsBlock';
import { SettingsHooks } from '../../../../../../data';

const OrderIntent = () => {
	const {
		authorizeOnly,
		setAuthorizeOnly,
		captureVirtualOnlyOrders,
		setCaptureVirtualOnlyOrders,
	} = SettingsHooks.useSettings();

	return (
		<SettingsBlock>
			<Header>
				<Title>
					{ __( 'Order Intent', 'woocommerce-paypal-payments' ) }
				</Title>
				<Description>
					{ __(
						'Choose between immediate capture or authorization-only, with manual capture in the Order section.',
						'woocommerce-paypal-payments'
					) }
				</Description>
			</Header>

			<ToggleSettingsBlock
				title={ __( 'Authorize Only', 'woocommerce-paypal-payments' ) }
				actionProps={ {
					callback: setAuthorizeOnly,
					key: 'authorizeOnly',
					value: authorizeOnly,
				} }
			/>

			<ToggleSettingsBlock
				title={ __(
					'Capture Virtual-Only Orders',
					'woocommerce-paypal-payments'
				) }
				actionProps={ {
					callback: setCaptureVirtualOnlyOrders,
					key: 'captureVirtualOnlyOrders',
					value: captureVirtualOnlyOrders,
				} }
			/>
		</SettingsBlock>
	);
};

export default OrderIntent;
