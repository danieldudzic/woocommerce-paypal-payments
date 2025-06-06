/**
 * Action Creators: Define functions to create action objects.
 *
 * These functions update state or trigger side effects (e.g., async operations).
 * Actions are categorized as Transient, Persistent, or Side effect.
 *
 * @file
 */

import apiFetch from '@wordpress/api-fetch';

import ACTION_TYPES from './action-types';
import { REST_PERSIST_PATH } from './constants';

/**
 * @typedef {Object} Action An action object that is handled by a reducer or control.
 * @property {string}  type    - The action type.
 * @property {Object?} payload - Optional payload for the action.
 * @property {string?} source  - Optional source context for tracking.
 */

/**
 * Special. Resets all values in the onboarding store to initial defaults.
 *
 * @param {string} source Optional source context for tracking.
 * @return {Action} The action.
 */
export const reset = ( source ) => ( {
	type: ACTION_TYPES.RESET,
	source,
} );

/**
 * Persistent. Set the full onboarding details, usually during app initialization.
 *
 * @param {{data: {}, flags?: {}}} payload
 * @return {Action} The action.
 */
export const hydrate = ( payload ) => ( {
	type: ACTION_TYPES.HYDRATE,
	payload,
	source: 'system',
} );

/**
 * Generic transient-data updater.
 *
 * @param {string} prop   Name of the property to update.
 * @param {any}    value  The new value of the property.
 * @param {string} source Optional source context for tracking.
 * @return {Action} The action.
 */
export const setTransient = ( prop, value, source = '' ) => ( {
	type: ACTION_TYPES.SET_TRANSIENT,
	payload: { [ prop ]: value },
	source,
	fieldName: prop,
} );

/**
 * Generic persistent-data updater.
 *
 * @param {string} prop   Name of the property to update.
 * @param {any}    value  The new value of the property.
 * @param {string} source Optional source context for tracking.
 * @return {Action} The action.
 */
export const setPersistent = ( prop, value, source ) => ( {
	type: ACTION_TYPES.SET_PERSISTENT,
	payload: { [ prop ]: value },
	source,
	fieldName: prop,
} );

/**
 * Transient. Marks the onboarding details as "ready", i.e., fully initialized.
 *
 * @param {boolean} isReady
 * @return {Action} The action.
 */
export const setIsReady = ( isReady ) =>
	setTransient( 'isReady', isReady, 'system' );

/**
 * Thunk action creator. Triggers the persistence of onboarding data to the server.
 *
 * @return {Function} The thunk function.
 */
export function persist() {
	return async ( { select } ) => {
		try {
			await apiFetch( {
				path: REST_PERSIST_PATH,
				method: 'POST',
				data: select.persistentData(),
			} );
		} catch ( e ) {
			// We catch errors here, as the onboarding module is not handled by the persistAll hook.
			console.error( 'Error saving progress.', e );
		}
	};
}

/**
 * Thunk action creator. Forces a data refresh from the REST API, replacing the current Redux values.
 *
 * @return {Function} The thunk function.
 */
export function refresh() {
	return ( { dispatch, select } ) => {
		dispatch.invalidateResolutionForStore();

		select.persistentData();
	};
}

/**
 * Persistent. Updates the gateway synced status.
 *
 * @param {boolean} synced The sync status to set.
 * @param {string}  source Optional source context for tracking.
 * @return {Action} The action.
 */
export const updateGatewaysSynced = ( synced = true, source ) =>
	setPersistent( 'gatewaysSynced', synced, source );

/**
 * Persistent. Updates the gateway refreshed status.
 *
 * @param {boolean} refreshed The refreshed status to set.
 * @param {string}  source    Optional source context for tracking.
 * @return {Action} The action.
 */
export const updateGatewaysRefreshed = ( refreshed = true, source ) =>
	setPersistent( 'gatewaysRefreshed', refreshed, source );

/**
 * Action creator to sync payment gateways.
 * This will both update the state and persist it.
 *
 * @param {string} source Optional source context for tracking.
 * @return {Function} The thunk function.
 */
export function syncGateways( source ) {
	return async ( { dispatch } ) => {
		dispatch( setPersistent( 'gatewaysSynced', true, source ) );
		await dispatch.persist();
		return { success: true };
	};
}

/**
 * Action creator to refresh payment gateways.
 *
 * @param {string} source Optional source context for tracking.
 * @return {Function} The thunk function.
 */
export function refreshGateways( source ) {
	return async ( { dispatch } ) => {
		dispatch( setPersistent( 'gatewaysRefreshed', true, source ) );
		await dispatch.persist();
		return { success: true };
	};
}

/**
 * Action creator to clear field source tracking.
 *
 * @param {string} fieldName - Name of the field to clear source for.
 * @return {Action} The action.
 */
export const clearFieldSource = ( fieldName ) => ( {
	type: ACTION_TYPES.CLEAR_FIELD_SOURCE,
	payload: { fieldName },
} );

/**
 * Transient. Updates the connection button clicked status.
 *
 * @param {boolean} clicked Whether the button was clicked.
 * @param {string}  source  Optional source context for tracking.
 * @return {Action} The action.
 */
export const setConnectionButtonClicked = ( clicked = true, source = 'user' ) =>
	setTransient( 'connectionButtonClicked', clicked, source );

/**
 * Persistent. Updates the current step in the onboarding flow.
 *
 * @param {number} step   The step number to set.
 * @param {string} source Optional source context for tracking.
 * @return {Action} The action.
 */
export const setStep = ( step, source ) =>
	setPersistent( 'step', step, source );

/**
 * Persistent. Updates the completed status of the onboarding.
 *
 * @param {boolean} completed Whether onboarding is completed.
 * @param {string}  source    Optional source context for tracking.
 * @return {Action} The action.
 */
export const setCompleted = ( completed, source ) =>
	setPersistent( 'completed', completed, source );

/**
 * Persistent. Updates the casual seller status.
 *
 * @param {boolean} isCasualSeller Whether the user is a casual seller.
 * @param {string}  source         Optional source context for tracking.
 * @return {Action} The action.
 */
export const setIsCasualSeller = ( isCasualSeller, source ) =>
	setPersistent( 'isCasualSeller', isCasualSeller, source );

/**
 * Persistent. Updates the optional payment methods setting.
 *
 * @param {boolean} enabled Whether optional payment methods are enabled.
 * @param {string}  source  Optional source context for tracking.
 * @return {Action} The action.
 */
export const setOptionalPaymentMethods = ( enabled, source ) =>
	setPersistent( 'areOptionalPaymentMethodsEnabled', enabled, source );

/**
 * Persistent. Updates the selected products.
 *
 * @param {Array}  products Array of selected product types.
 * @param {string} source   Optional source context for tracking.
 * @return {Action} The action.
 */
export const setProducts = ( products, source ) =>
	setPersistent( 'products', products, source );

/**
 * Transient. Updates the manual client ID.
 *
 * @param {string} clientId The manual client ID.
 * @param {string} source   Optional source context for tracking.
 * @return {Action} The action.
 */
export const setManualClientId = ( clientId, source ) =>
	setTransient( 'manualClientId', clientId, source );

/**
 * Transient. Updates the manual client secret.
 *
 * @param {string} clientSecret The manual client secret.
 * @param {string} source       Optional source context for tracking.
 * @return {Action} The action.
 */
export const setManualClientSecret = ( clientSecret, source ) =>
	setTransient( 'manualClientSecret', clientSecret, source );
