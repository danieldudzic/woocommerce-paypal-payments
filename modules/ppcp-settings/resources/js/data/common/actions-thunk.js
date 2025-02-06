import { select } from '@wordpress/data';

import ACTION_TYPES from './action-types';
import { hydrate } from './actions';
import { STORE_NAME } from './constants';

/**
 * Side effect. Saves the persistent details to the WP database.
 *
 * @return {Action} The action.
 */
export const persist = function* () {
	const data = yield select( STORE_NAME ).persistentData();

	yield { type: ACTION_TYPES.DO_PERSIST_DATA, data };
};

/**
 * Side effect. Fetches the ISU-login URL for a sandbox account.
 *
 * @return {Action} The action.
 */
export const sandboxOnboardingUrl = function* () {
	return yield {
		type: ACTION_TYPES.DO_GENERATE_ONBOARDING_URL,
		useSandbox: true,
		products: [ 'EXPRESS_CHECKOUT' ],
	};
};

/**
 * Side effect. Fetches the ISU-login URL for a production account.
 *
 * @param {string[]} products Which products/features to display in the ISU popup.
 * @return {Action} The action.
 */
export const productionOnboardingUrl = function* ( products = [] ) {
	return yield {
		type: ACTION_TYPES.DO_GENERATE_ONBOARDING_URL,
		useSandbox: false,
		products,
	};
};

/**
 * Side effect. Initiates a direct connection attempt using the provided client ID and secret.
 *
 * This action accepts parameters instead of fetching data from the Redux state because the
 * values (ID and secret) are not managed by a central redux store, but might come from private
 * component state.
 *
 * @param {string}  clientId     - AP client ID (always 80-characters, starting with "A").
 * @param {string}  clientSecret - API client secret.
 * @param {boolean} useSandbox   - Whether the credentials are for a sandbox account.
 * @return {Action} The action.
 */
export const authenticateWithCredentials = function* (
	clientId,
	clientSecret,
	useSandbox
) {
	return yield {
		type: ACTION_TYPES.DO_DIRECT_API_AUTHENTICATION,
		clientId,
		clientSecret,
		useSandbox,
	};
};

/**
 * Side effect. Completes the ISU login by authenticating the user via the one time sharedId and
 * authCode provided by PayPal.
 *
 * This action accepts parameters instead of fetching data from the Redux state because all
 * parameters are dynamically generated during the authentication process, and not managed by our
 * Redux store.
 *
 * @param {string}  sharedId   - OAuth client ID; called "sharedId" to prevent confusion with the API client ID.
 * @param {string}  authCode   - OAuth authorization code provided during onboarding.
 * @param {boolean} useSandbox - Whether the credentials are for a sandbox account.
 * @return {Action} The action.
 */
export const authenticateWithOAuth = function* (
	sharedId,
	authCode,
	useSandbox
) {
	return yield {
		type: ACTION_TYPES.DO_OAUTH_AUTHENTICATION,
		sharedId,
		authCode,
		useSandbox,
	};
};

/**
 * Side effect. Checks webhook simulation.
 *
 * @return {Action} The action.
 */
export const disconnectMerchant = function* () {
	return yield { type: ACTION_TYPES.DO_DISCONNECT_MERCHANT };
};

/**
 * Side effect. Clears and refreshes the merchant data via a REST request.
 *
 * @return {Action} The action.
 */
export const refreshMerchantData = function* () {
	const result = yield { type: ACTION_TYPES.DO_REFRESH_MERCHANT };

	if ( result.success && result.merchant ) {
		yield hydrate( result );
	}

	return result;
};

/**
 * Side effect.
 * Purges all feature status data via a REST request.
 * Refreshes the merchant data via a REST request.
 *
 * @return {Action} The action.
 */
export const refreshFeatureStatuses = function* () {
	const result = yield { type: ACTION_TYPES.DO_REFRESH_FEATURES };

	if ( result && result.success ) {
		// TODO: Review if we can get the updated feature details in the result.data instead of
		//       doing a second refreshMerchantData() request.
		yield refreshMerchantData();
	}

	return result;
};

/**
 * Side effect
 * Refreshes subscribed webhooks via a REST request
 *
 * @return {Action} The action.
 */
export const resubscribeWebhooks = function* () {
	const result = yield { type: ACTION_TYPES.DO_RESUBSCRIBE_WEBHOOKS };

	if ( result && result.success ) {
		yield hydrate( result );
	}

	return result;
};

/**
 * Side effect. Starts webhook simulation.
 *
 * @return {Action} The action.
 */
export const startWebhookSimulation = function* () {
	return yield { type: ACTION_TYPES.DO_START_WEBHOOK_SIMULATION };
};

/**
 * Side effect. Checks webhook simulation.
 *
 * @return {Action} The action.
 */
export const checkWebhookSimulationState = function* () {
	return yield { type: ACTION_TYPES.DO_CHECK_WEBHOOK_SIMULATION };
};
