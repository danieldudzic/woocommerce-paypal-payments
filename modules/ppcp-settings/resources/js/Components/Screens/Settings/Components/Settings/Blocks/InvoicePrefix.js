import { __ } from '@wordpress/i18n';
import { ControlTextInput } from '../../../../../ReusableComponents/SettingsBlocks';
import { SettingsHooks } from '../../../../../../data';
import SettingsBlock from '../../../../../ReusableComponents/SettingsBlock';

const InvoicePrefix = () => {
	const { invoicePrefix, setInvoicePrefix } = SettingsHooks.useSettings();

	return (
		<SettingsBlock
			title="Invoice Prefix"
			supplementaryLabel={ __(
				'(Recommended)',
				'woocommerce-paypal-payments'
			) }
			description="Add a unique prefix to invoice numbers for site-specific tracking (recommended)."
		>
			<ControlTextInput
				placeholder={ __(
					'Input prefix',
					'woocommerce-paypal-payments'
				) }
				onChange={ setInvoicePrefix }
				value={ invoicePrefix }
			/>
		</SettingsBlock>
	);
};

export default InvoicePrefix;
