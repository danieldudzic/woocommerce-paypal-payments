import { __ } from '@wordpress/i18n';
import { InputSettingsBlock } from '../../../../../ReusableComponents/SettingsBlocks';
import { SettingsHooks } from '../../../../../../data';

const InvoicePrefix = () => {
	const { invoicePrefix, setInvoicePrefix } = SettingsHooks.useSettings();

	return (
		<InputSettingsBlock
			title="Invoice Prefix"
			supplementaryLabel={ __(
				'(Recommended)',
				'woocommerce-paypal-payments'
			) }
			description="Add a unique prefix to invoice numbers for site-specific tracking (recommended)."
			actionProps={ {
				key: 'invoicePrefix',
				callback: setInvoicePrefix,
				value: invoicePrefix,
				placeholder: __(
					'Input prefix',
					'woocommerce-paypal-payments'
				),
			} }
		/>
	);
};

export default InvoicePrefix;
