import { __ } from '@wordpress/i18n';

import {
	PayWithPayPal,
	PayLater,
	Venmo,
	Crypto,
	PayInThree,
	CardFields,
	DigitalWallets,
	AlternativePaymentMethods,
	Fastlane,
	CreditDebitCards,
} from '../Components/PaymentOptions';
import { useMemo } from '@wordpress/element';

// Default configuration, used for all countries, unless they override individual attributes below.
const defaultConfig = {
	includedMethods: [
		{ name: 'PayWithPayPal', Component: PayWithPayPal },
		{ name: 'PayLater', Component: PayLater },
	],
	optionalMethods: [
		{ name: 'CreditDebitCards', Component: CreditDebitCards },
		{ name: 'DigitalWallets', Component: DigitalWallets },
		{ name: 'APMs', Component: AlternativePaymentMethods },
	],
	optionalTitle: __(
		'Optional payment methods',
		'woocommerce-paypal-payments'
	),
	optionalDescription: __(
		'with additional application',
		'woocommerce-paypal-payments'
	),
};

const learnMoreLinks = {
	US: {
		PayPalCheckout:
			'https://www.paypal.com/us/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/us/business/accept-payments/checkout/installments',
		Venmo: 'https://www.paypal.com/us/enterprise/payment-processing/accept-venmo',
		Crypto: 'https://www.paypal.com/us/digital-wallet/manage-money/crypto',
		OptionalMethods:
			'https://www.paypal.com/us/business/accept-payments/checkout/integration#expanded-checkout',
		Fastlane:
			'https://www.paypal.com/us/enterprise/payment-processing/guest-checkout',
	},
	CA: {
		PayPalCheckout:
			'https://www.paypal.com/ca/business/accept-payments/checkout',
	},
	GB: {
		PayPalCheckout:
			'https://www.paypal.com/uk/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/uk/business/accept-payments/checkout/installments',
	},
	FR: {
		PayPalCheckout:
			'https://www.paypal.com/fr/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/fr/business/accept-payments/checkout/installments',
	},
	ES: {
		PayPalCheckout:
			'https://www.paypal.com/es/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/es/business/accept-payments/checkout/installments',
	},
	IT: {
		PayPalCheckout:
			'https://www.paypal.com/it/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/it/business/accept-payments/checkout/installments',
	},
	DE: {
		PayPalCheckout:
			'https://www.paypal.com/de/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/de/business/accept-payments/checkout/installments',
	},
	AU: {
		PayPalCheckout:
			'https://www.paypal.com/au/business/accept-payments/checkout',
		PayLater:
			'https://www.paypal.com/au/business/accept-payments/checkout/installments',
	},
};

const countrySpecificConfigs = {
	US: {
		includedMethods: [
			{ name: 'PayWithPayPal', Component: PayWithPayPal },
			{ name: 'PayLater', Component: PayLater },
			{ name: 'Venmo', Component: Venmo },
			{ name: 'Crypto', Component: Crypto },
		],
		optionalMethods: [
			{ name: 'CardFields', Component: CardFields },
			{ name: 'DigitalWallets', Component: DigitalWallets },
			{ name: 'APMs', Component: AlternativePaymentMethods },
			{ name: 'Fastlane', Component: Fastlane },
		],
		optionalTitle: __( 'Expanded Checkout', 'woocommerce-paypal-payments' ),
		optionalDescription: __(
			'Accept debit/credit cards, PayPal, Apple Pay, Google Pay, and more. Note: Additional application required for more methods',
			'woocommerce-paypal-payments'
		),
	},
	GB: {
		includedMethods: [
			{ name: 'PayWithPayPal', Component: PayWithPayPal },
			{ name: 'PayLater', Component: PayLater },
			{ name: 'PayInThree', Component: PayInThree },
		],
	},
};

const filterMethods = ( methods, conditions ) => {
	return methods.filter( ( method ) =>
		conditions.every( ( condition ) => condition( method ) )
	);
};

export const usePaymentConfig = (
	country,
	isPayLater,
	useAcdc,
	isFastlane
) => {
	return useMemo( () => {
		const countryConfig = countrySpecificConfigs[ country ] || {};
		const config = { ...defaultConfig, ...countryConfig };
		const learnMoreConfig = learnMoreLinks[ country ] || {};

		const includedMethods = filterMethods( config.includedMethods, [
			( method ) => isPayLater || method.name !== 'PayLater',
		] );

		const optionalMethods = filterMethods( config.optionalMethods, [
			( method ) => method.name !== 'Fastlane' || isFastlane,
		] );

		return {
			...config,
			includedMethods,
			optionalMethods,
			learnMoreConfig,
		};
	}, [ country, isPayLater, useAcdc, isFastlane ] );
};
