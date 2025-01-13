/**
 * Name of the Redux store module.
 *
 * Used by: Reducer, Selector, Index
 *
 * @type {string}
 */
export const STORE_NAME = 'wc/paypal/onboarding';

/**
 * REST path to hydrate data of this module by loading data from the WP DB.
 *
 * Used by: Resolvers
 * See: OnboardingRestEndpoint.php
 *
 * @type {string}
 */
export const REST_HYDRATE_PATH = '/wc/v3/wc_paypal/onboarding';

/**
 * REST path to persist data of this module to the WP DB.
 *
 * Used by: Controls
 * See: OnboardingRestEndpoint.php
 *
 * @type {string}
 */
export const REST_PERSIST_PATH = '/wc/v3/wc_paypal/onboarding';

/**
 * Onboarding options for StepBusiness
 *
 * @type {Object}
 */
export const BUSINESS_TYPES = {
	CASUAL_SELLER: 'casual_seller',
	BUSINESS: 'business',
};

/**
 * Onboarding options for StepProducts
 *
 * @type {Object}
 */
export const PRODUCT_TYPES = {
	VIRTUAL: 'virtual',
	PHYSICAL: 'physical',
	SUBSCRIPTIONS: 'subscriptions',
};
