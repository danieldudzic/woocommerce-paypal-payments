import { __ } from '@wordpress/i18n';

import SettingsCard from '../../../../ReusableComponents/SettingsCard';
import { CommonHooks } from '../../../../../data';
import SettingValueRow from './Parts/SettingValueRow';
import ConnectionStatusBadge from './Parts/ConnectionStatusBadge';

const ConnectionStatus = () => {
	const { merchant } = CommonHooks.useMerchantInfo();

	return (
		<SettingsCard
			className="ppcp-r-tab-connection-details"
			title={ __( 'Connection status', 'woocommerce-paypal-payments' ) }
			description={ __(
				'Your PayPal account connection details',
				'woocommerce-paypal-payments'
			) }
		>
			<div className="ppcp-r-setting-value-rows">
				<SettingValueRow
					value={
						<ConnectionStatusBadge
							isActive={ merchant.isConnected }
							isSandbox={ merchant.isSandbox }
						/>
					}
				/>
				<SettingValueRow
					label={ __( 'Merchant ID', 'woocommerce-paypal-payments' ) }
					value={ merchant.id }
				/>
				<SettingValueRow
					label={ __(
						'Email address',
						'woocommerce-paypal-payments'
					) }
					value={ merchant.email }
				/>
				<SettingValueRow
					label={ __( 'Client ID', 'woocommerce-paypal-payments' ) }
					value={ merchant.clientId }
				/>
			</div>
		</SettingsCard>
	);
};

export default ConnectionStatus;
