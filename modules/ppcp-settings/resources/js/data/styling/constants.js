import { __ } from '@wordpress/i18n';

/**
 * Name of the Redux store module.
 *
 * Used by: Reducer, Selector, Index
 *
 * @type {string}
 */
export const STORE_NAME = 'wc/paypal/style';

/**
 * REST path to hydrate data of this module by loading data from the WP DB.
 *
 * Used by: Resolvers
 * See: StylingRestEndpoint.php
 *
 * @type {string}
 */
export const REST_HYDRATE_PATH = '/wc/v3/wc_paypal/styling';

/**
 * REST path to persist data of this module to the WP DB.
 *
 * Used by: Controls
 * See: StylingRestEndpoint.php
 *
 * @type {string}
 */
export const REST_PERSIST_PATH = '/wc/v3/wc_paypal/styling';

export const STYLING_LOCATIONS = {
	cart: {
		value: 'cart',
		label: __( 'Cart', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'Customize the appearance of the PayPal smart buttons on the <a href="%s">Cart page</a> and select which additional payment buttons to display in this location.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'classic-checkout': {
		value: 'classic-checkout',
		label: __( 'Classic Checkout', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'Customize the appearance of the PayPal smart buttons on the <a href="%s">Classic Checkout page</a> and choose which additional payment buttons to display in this location.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'express-checkout': {
		value: 'express-checkout',
		label: __( 'Express Checkout', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'Customize the appearance of the PayPal smart buttons on the <a href="%s">Express Checkout location</a> and choose which additional payment buttons to display in this location.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'mini-cart': {
		value: 'mini-cart',
		label: __( 'Mini Cart', 'woocommerce-paypel-payements' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'Customize the appearance of the PayPal smart buttons on the <a href="%s">Mini Cart</a> and choose which additional payment buttons to display in this location.',
			'wooocommerce-paypal-payments'
		),
		link: '#',
	},
	'product-page': {
		value: 'product-page',
		label: __( 'Product Page', 'woocommerce-paypal-payments' ),
		// translators: %s is the URL to a documentation page.
		description: __(
			'Customize the appearance of the PayPal smart buttons on the <a href="%s">Product Page</a> and choose which additional payment buttons to display in this location.',
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
