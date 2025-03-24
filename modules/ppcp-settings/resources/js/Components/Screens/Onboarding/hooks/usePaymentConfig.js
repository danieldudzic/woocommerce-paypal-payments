import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

import { learnMoreLinks } from '../../../../utils/countryInfoLinks';
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

// List of all payment icons and which requirements they have.
const allIcons = [
	{ name: 'paypal', always: true },
	{ name: 'venmo', isOwnBrand: true, isAcdc: false, countries: [ 'US' ] },
	{ name: 'visa', isOwnBrand: false, isAcdc: false },
	{ name: 'mastercard', isOwnBrand: false, isAcdc: false },
	{ name: 'amex', isOwnBrand: false, isAcdc: false },
	{ name: 'discover', isOwnBrand: false, isAcdc: false },
	{ name: 'apple-pay', isOwnBrand: false, isAcdc: true },
	{ name: 'google-pay', isOwnBrand: false, isAcdc: true },
	{ name: 'ideal', isOwnBrand: true, isAcdc: true },
	{ name: 'bancontact', isOwnBrand: true, isAcdc: true },
];

// Default configuration, used for all countries, unless they override individual attributes below.
const defaultConfig = {
	// Included: Items in the left column.
	includedMethods: [
		{ name: 'PayWithPayPal', Component: PayWithPayPal },
		{ name: 'PayLater', Component: PayLater },
	],

	// Basic: Items on right side for BCDC-flow.
	basicMethods: [ { name: 'CreditDebitCards', Component: CreditDebitCards } ],

	// Extended: Items on right side for ACDC-flow.
	extendedMethods: [
		{ name: 'CardFields', Component: CardFields },
		{ name: 'DigitalWallets', Component: DigitalWallets },
		{ name: 'APMs', Component: AlternativePaymentMethods },
	],

	// Title, Description: Header above the right column items.
	optionalTitle: __(
		'Optional payment methods',
		'woocommerce-paypal-payments'
	),
	optionalDescription: __(
		'with additional application',
		'woocommerce-paypal-payments'
	),

	// PayPal Checkout description.
	paypalCheckoutDescription: __(
		'Our all-in-one checkout solution lets you offer PayPal, Pay Later options, and more to help maximise conversion',
		'woocommerce-paypal-payments'
	),
};

const countrySpecificConfigs = {
	US: {
		includedMethods: [
			{ name: 'PayWithPayPal', Component: PayWithPayPal },
			{ name: 'PayLater', Component: PayLater },
			{ name: 'Venmo', Component: Venmo },
			{ name: 'Crypto', Component: Crypto },
		],
		basicMethods: [
			{ name: 'CreditDebitCards', Component: CreditDebitCards },
		],
		extendedMethods: [
			{ name: 'CardFields', Component: CardFields },
			{ name: 'DigitalWallets', Component: DigitalWallets },
			{ name: 'APMs', Component: AlternativePaymentMethods },
			{ name: 'Fastlane', Component: Fastlane },
		],
		paypalCheckoutDescription: __(
			'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximise conversion',
			'woocommerce-paypal-payments'
		),
		optionalTitle: __( 'Expanded Checkout', 'woocommerce-paypal-payments' ),
		optionalDescription: __(
			'Accept debit/credit cards, PayPal, Apple Pay, Google Pay, and more. Note: Additional application required for more methods',
			'woocommerce-paypal-payments'
		),
	},
	GB: {
		includedMethods: [
			{ name: 'PayWithPayPal', Component: PayWithPayPal },
			{ name: 'PayInThree', Component: PayInThree },
		],
	},
	MX: {
		extendedMethods: [
			{ name: 'CardFields', Component: CardFields },
			{ name: 'APMs', Component: AlternativePaymentMethods },
		],
	},
};

/**
 * Returns a list of icon names that are available to the relevant merchant.
 *
 * @param {string}  country     Merchant country, 2-character ISO code.
 * @param {boolean} includeAcdc Whether to include advanced card payment methods.
 * @param {boolean} onlyBranded Whether to return only branded payment methods.
 * @return {string[]} List of icon names.
 */
const selectRelevantIcons = ( country, includeAcdc, onlyBranded ) => {
	return allIcons
		.filter( ( { always, isOwnBrand, isAcdc, countries = [] } ) => {
			if ( always ) {
				return true;
			}

			if ( onlyBranded && ! isOwnBrand ) {
				return false;
			}

			if ( ! includeAcdc && isAcdc ) {
				return false;
			}

			return ! countries.length || countries.includes( country );
		} )
		.map( ( icon ) => icon.name );
};

const filterMethods = ( methods, conditions ) => {
	return methods.filter( ( method ) =>
		conditions.every( ( condition ) => condition( method ) )
	);
};

export const usePaymentConfig = (
	country,
	canUseCardPayments,
	hasFastlane,
	ownBrandOnly
) => {
	return useMemo( () => {
		// eslint-disable-next-line no-console
		console.log( '[Payment Config]', {
			country,
			canUseCardPayments,
			hasFastlane,
			ownBrandOnly,
		} );

		const countryConfig = countrySpecificConfigs[ country ] || {};
		const config = { ...defaultConfig, ...countryConfig };
		const learnMoreConfig = learnMoreLinks[ country ] || {};

		// Determine the "right side" items: Either BCDC or ACDC items.
		const optionalMethods = canUseCardPayments
			? config.extendedMethods
			: config.basicMethods;

		// Remove conditional items from the right side list.
		const availableOptionalMethods = filterMethods( optionalMethods, [
			( method ) => method.name !== 'Fastlane' || hasFastlane,
		] );

		const icons = selectRelevantIcons(
			country,
			canUseCardPayments,
			ownBrandOnly
		);

		return {
			...config,
			optionalMethods: availableOptionalMethods,
			learnMoreConfig,
			icons,
		};
	}, [ country, canUseCardPayments, hasFastlane, ownBrandOnly ] );
};
