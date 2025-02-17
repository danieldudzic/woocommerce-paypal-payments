/**
 * Constants: Define store configuration values.
 *
 * @file
 */

export const STORE_NAME = 'wc/paypal/features';

/**
 * REST path to hydrate data of this module by loading data from the WP DB.
 *
 * Used by: Resolvers
 * See: <UNKNOWN>.php
 *
 * @type {string}
 */
export const REST_HYDRATE_PATH = '/wc/v3/wc_paypal/features';

/**
 * REST path to persist data of this module to the WP DB.
 *
 * Used by: Controls
 * See: <UNKNOWN>.php
 *
 * @type {string}
 */
export const REST_PERSIST_PATH = '/wc/v3/wc_paypal/features';
