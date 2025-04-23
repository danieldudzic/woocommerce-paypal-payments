import { __ } from '@wordpress/i18n';

import Accordion from '../../../../../ReusableComponents/AccordionSection';
import SettingsBlock from '../../../../../ReusableComponents/SettingsBlock';
import {
	ControlSelect,
	ControlRadioGroup,
} from '../../../../../ReusableComponents/Controls';
import { SettingsHooks } from '../../../../../../data';

const OtherSettings = () => {
	const { disabledCards, setDisabledCards, threeDSecure, setThreeDSecure } =
		SettingsHooks.useSettings();

	return (
		<Accordion
			title={ __(
				'Other payment method settings',
				'woocommerce-paypal-payments'
			) }
			description={ __(
				'Modify the checkout experience for alternative payment methods, credit cards, and digital wallets.',
				'woocommerce-paypal-payments'
			) }
		>
			<SettingsBlock
				title={ __(
					'Disable specific credit cards',
					'woocommerce-paypal-payments'
				) }
				description={ __(
					'By default, all possible credit cards will be accepted. Card types added here will be rejected at checkout.',
					'woocommerce-paypal-payments'
				) }
			>
				<ControlSelect
					options={ disabledCardChoices }
					value={ disabledCards }
					onChange={ setDisabledCards }
					isMulti={ true }
					placeholder={ __(
						'Show all cards',
						'woocommerce-paypal-payments'
					) }
				/>
			</SettingsBlock>

			<SettingsBlock
				title={ __( '3D Secure', 'woocommerce-paypal-payments' ) }
				description={ __(
					'Authenticate cardholders through their card issuers to reduce fraud and improve transaction security. Successful 3D Secure authentication can shift liability for fraudulent chargebacks to the card issuer.',
					'woocommerce-paypal-payments'
				) }
			>
				<ControlRadioGroup
					options={ threeDSecureOptions }
					value={ threeDSecure }
					onChange={ setThreeDSecure }
				/>
			</SettingsBlock>
		</Accordion>
	);
};

const disabledCardChoices = [
	{ value: '', label: __( 'Select', 'woocommerce-paypal-payments' ) },
	{
		value: 'mastercard',
		label: __( 'Mastercard', 'woocommerce-paypal-payments' ),
	},
	{ value: 'visa', label: __( 'Visa', 'woocommerce-paypal-payments' ) },
	{
		value: 'amex',
		label: __( 'American Express', 'woocommerce-paypal-payments' ),
	},
	{ value: 'jcb', label: __( 'JCB', 'woocommerce-paypal-payments' ) },
	{
		value: 'diners-club',
		label: __( 'Diners Club', 'woocommerce-paypal-payments' ),
	},
];

const threeDSecureOptions = [
	{
		value: 'no-3d-secure',
		label: __( 'No 3D Secure', 'woocommerce-paypal-payments' ),
		description: __(
			'Do not use 3D Secure authentication for any transactions.',
			'woocommerce-paypal-payments'
		),
	},
	{
		value: 'only-required-3d-secure',
		label: __( 'Only when required', 'woocommerce-paypal-payments' ),
		description: __(
			'Use 3D Secure when required by the card issuer or payment processor.',
			'woocommerce-paypal-payments'
		),
	},
	{
		value: 'always-3d-secure',
		label: __( 'Always require 3D Secure', 'woocommerce-paypal-payments' ),
		description: __(
			'Always authenticate transactions with 3D Secure when available.',
			'woocommerce-paypal-payments'
		),
	},
];

export default OtherSettings;
