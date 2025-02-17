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
import { dispatch } from '@wordpress/data';

/**
 * @typedef {Object} Action An action object that is handled by a reducer or control.
 * @property {string}  type    - The action type.
 * @property {Object?} payload - Optional payload for the action.
 */

/**
 * Persistent. Set the full store details during app initialization.
 *
 * @param {{data: {}, flags?: {}}} payload
 * @return {Action} The action.
 */
export const hydrate = ( payload ) => ( {
	type: ACTION_TYPES.HYDRATE,
	payload,
} );

/**
 * Generic transient-data updater.
 *
 * @param {string} prop  Name of the property to update.
 * @param {any}    value The new value of the property.
 * @return {Action} The action.
 */
export const setTransient = ( prop, value ) => ( {
	type: ACTION_TYPES.SET_TRANSIENT,
	payload: { [ prop ]: value },
} );

/**
 * Generic persistent-data updater.
 *
 * @param {string} prop  Name of the property to update.
 * @param {any}    value The new value of the property.
 * @return {Action} The action.
 */
export const setPersistent = ( prop, value ) => ( {
	type: ACTION_TYPES.SET_PERSISTENT,
	payload: { [ prop ]: value },
} );

/**
 * Transient. Marks the store as "ready", i.e., fully initialized.
 *
 * @param {boolean} isReady
 * @return {Action} The action.
 */
export const setIsReady = ( isReady ) => setTransient( 'isReady', isReady );

/**
 * Thunk action creator. Triggers the persistence of store data to the server.
 *
 * @return {Function} The thunk function.
 */
export function persist() {
	return async ( { select } ) => {
		await apiFetch( {
			path: REST_PERSIST_PATH,
			method: 'POST',
			data: select.persistentData(),
		} );
	};
}

export function fetchFeatures() {
	return async () => {
		const response = await apiFetch( { path: REST_PERSIST_PATH } );
		const features = response?.data || [];
		dispatch( setFeatures( features ) );
	};
}
