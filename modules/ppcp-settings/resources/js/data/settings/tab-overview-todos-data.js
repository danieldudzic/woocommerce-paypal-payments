import { __ } from '@wordpress/i18n';
import { selectTab, TAB_IDS } from '../../utils/tabSelector';

export const todosData = [
	{
		id: 'enable_fastlane',
		title: __( 'Enable Fastlane', 'woocommerce-paypal-payments' ),
		description: __(
			'Accelerate your guest checkout with Fastlane by PayPal.',
			'woocommerce-paypal-payments'
		),
		isCompleted: () => {
			return false;
		},
		onClick: () => {
			selectTab( TAB_IDS.PAYMENT_METHODS, 'ppcp-card-payments-card' );
		},
	},
	{
		id: 'enable_credit_debit_cards',
		title: __(
			'Enable Credit and Debit Cards on your checkout',
			'woocommerce-paypal-payments'
		),
		description: __(
			'Credit and Debit Cards is now available for Blocks checkout pages.',
			'woocommerce-paypal-payments'
		),
		isCompleted: () => {
			return false;
		},
		onClick: () => {
			selectTab( TAB_IDS.PAYMENT_METHODS, 'ppcp-card-payments-card' );
		},
	},
	{
		id: 'enable_pay_later_messaging',
		title: __(
			'Enable Pay Later messaging',
			'woocommerce-paypal-payments'
		),
		description: __(
			'Show Pay Later messaging to boost conversion rate and increase cart size.',
			'woocommerce-paypal-payments'
		),
		isCompleted: () => {
			return false;
		},
		onClick: () => {
			selectTab( TAB_IDS.OVERVIEW, 'pay_later_messaging' );
		},
	},
];
