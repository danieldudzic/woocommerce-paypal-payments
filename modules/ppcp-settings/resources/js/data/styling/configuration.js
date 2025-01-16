/**
 * Configuration for UI components.
 *
 * @file
 */

import { __ } from '@wordpress/i18n';

export const STYLING_LOCATIONS = {
	cart: {
		value: 'cart',
		label: __( 'Cart', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'More details on the <a href="%s">Cart page</a>.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'classic-checkout': {
		value: 'classic-checkout',
		label: __( 'Classic Checkout', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'More details on the <a href="%s">Classic Checkout page</a>.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'express-checkout': {
		value: 'express-checkout',
		label: __( 'Express Checkout', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'More details on the <a href="%s">Express Checkout location</a>.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'mini-cart': {
		value: 'mini-cart',
		label: __( 'Mini Cart', 'woocommerce-paypel-payements' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'More details on the <a href="%s">Mini Cart</a>.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'product-page': {
		value: 'product-page',
		label: __( 'Product Page', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'More details on the <a href="%s">Product Page</a>.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
};

export const STYLING_LABELS = {
	paypal: {
		value: 'paypal',
		label: __( 'PayPal', 'woocommerce-paypal-payments' ),
	},
	checkout: {
		value: 'checkout',
		label: __( 'Checkout', 'woocommerce-paypal-payments' ),
	},
	buynow: {
		value: 'buynow',
		label: __( 'PayPal Buy Now', 'woocommerce-paypal-payments' ),
	},
	pay: {
		value: 'pay',
		label: __( 'Pay with PayPal', 'woocommerce-paypal-payments' ),
	},
};

export const STYLING_COLORS = {
	gold: {
		value: 'gold',
		label: __( 'Gold (Recommended)', 'woocommerce-paypal-payments' ),
	},
	blue: {
		value: 'blue',
		label: __( 'Blue', 'woocommerce-paypal-payments' ),
	},
	silver: {
		value: 'silver',
		label: __( 'Silver', 'woocommerce-paypal-payments' ),
	},
	black: {
		value: 'black',
		label: __( 'Black', 'woocommerce-paypal-payments' ),
	},
	white: {
		value: 'white',
		label: __( 'White', 'woocommerce-paypal-payments' ),
	},
};

export const STYLING_LAYOUTS = {
	vertical: {
		value: 'vertical',
		label: __( 'Vertical', 'woocommerce-paypal-payments' ),
	},
	horizontal: {
		value: 'horizontal',
		label: __( 'Horizontal', 'woocommerce-paypal-payments' ),
	},
};

export const STYLING_SHAPES = {
	pill: {
		value: 'pill',
		label: __( 'Pill', 'woocommerce-paypal-payments' ),
	},
	rect: {
		value: 'rect',
		label: __( 'Rectangle', 'woocommerce-paypal-payments' ),
	},
};

export const STYLING_PAYMENT_METHODS = {
	paypal: {
		value: '',
		label: __( 'PayPal', 'woocommerce-paypal-payments' ),
		checked: true,
		disabled: true,
	},
	venmo: {
		value: 'venmo',
		label: __( 'Venmo', 'woocommerce-paypal-payments' ),
	},
	paylater: {
		value: 'paylater',
		label: __( 'Pay Later', 'woocommerce-paypal-payments' ),
	},
	googlepay: {
		value: 'googlepay',
		label: __( 'Google Pay', 'woocommerce-paypal-payments' ),
	},
	applepay: {
		value: 'applepay',
		label: __( 'Apple Pay', 'woocommerce-paypal-payments' ),
	},
};
