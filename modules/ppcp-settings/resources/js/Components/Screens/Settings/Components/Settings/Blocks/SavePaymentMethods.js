import { __, sprintf } from '@wordpress/i18n';
import {
	Header,
	Title,
	Description,
} from '../../../../../ReusableComponents/Elements';
import SettingsBlock from '../../../../../ReusableComponents/SettingsBlock';
import { ToggleSettingsBlock } from '../../../../../ReusableComponents/SettingsBlocks';
import { SettingsHooks } from '../../../../../../data';

const SavePaymentMethods = () => {
	const {
		savePaypalAndVenmo,
		setSavePaypalAndVenmo,
		saveCardDetails,
		setSaveCardDetails,
	} = SettingsHooks.useSettings();

	return (
		<SettingsBlock className="ppcp-r-settings-block--save-payment-methods">
			<Header>
				<Title>
					{ __(
						'Save payment methods',
						'woocommerce-paypal-payments'
					) }
				</Title>
				<Description>
					{ __(
						"Securely store customers' payment methods for future payments and subscriptions, simplifying checkout and enabling recurring transactions.",
						'woocommerce-paypal-payments'
					) }
				</Description>
			</Header>

			<ToggleSettingsBlock
				title={ __(
					'Save PayPal and Venmo',
					'woocommerce-paypal-payments'
				) }
				description={
					<div
						dangerouslySetInnerHTML={ {
							__html: sprintf(
								/* translators: 1: URL to Pay Later documentation, 2: URL to Alternative Payment Methods documentation */
								__(
									'Securely store your customers\' PayPal accounts for a seamless checkout experience. <br />This will disable all <a target="_blank" rel="noreferrer" href="%1$s">Pay Later</a> features and <a target="_blank" rel="noreferrer" href="%2$s">Alternative Payment Methods</a> on your site.',
									'woocommerce-paypal-payments'
								),
								'https://woocommerce.com/document/woocommerce-paypal-payments/#pay-later',
								'https://woocommerce.com/document/woocommerce-paypal-payments/#alternative-payment-methods'
							),
						} }
					/>
				}
				actionProps={ {
					value: savePaypalAndVenmo,
					callback: setSavePaypalAndVenmo,
					key: 'savePaypalAndVenmo',
				} }
			/>

			<ToggleSettingsBlock
				title={ __(
					'Save Credit and Debit Cards',
					'woocommerce-paypal-payments'
				) }
				description={ __(
					"Securely store your customer's credit card.",
					'woocommerce-paypal-payments'
				) }
				actionProps={ {
					callback: setSaveCardDetails,
					key: 'saveCreditCardAndDebitCard',
					value: saveCardDetails,
				} }
			/>
		</SettingsBlock>
	);
};

export default SavePaymentMethods;
