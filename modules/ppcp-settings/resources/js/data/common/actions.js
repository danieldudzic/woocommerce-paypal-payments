/**
 * Action Creators: Define functions to create action objects.
 *
 * These functions update state or trigger side effects (e.g., async operations).
 * Actions are categorized as Transient, Persistent, or Side effect.
 *
 * @file
 */

import ACTION_TYPES from './action-types';

/**
 * @typedef {Object} Action An action object that is handled by a reducer or control.
 * @property {string}  type    - The action type.
 * @property {Object?} payload - Optional payload for the action.
 */

/**
 * Special. Resets all values in the onboarding store to initial defaults.
 *
 * @return {Action} The action.
 */
export const reset = () => ( { type: ACTION_TYPES.RESET } );

/**
 * Persistent. Set the full onboarding details, usually during app initialization.
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
export const setPersistent = ( prop, value, source = '' ) => {
	return {
		type: ACTION_TYPES.SET_PERSISTENT,
		payload: { [ prop ]: value },
		source,
		fieldName: prop,
	};
};

/**
 * Transient. Marks the onboarding details as "ready", i.e., fully initialized.
 *
 * @param {boolean} isReady
 * @return {Action} The action.
 */
export const setIsReady = ( isReady ) => setTransient( 'isReady', isReady );

/**
 * Transient. Sets the active settings tab.
 *
 * @param {string} activeModal
 * @return {Action} The action.
 */
export const setActiveModal = ( activeModal ) =>
	setTransient( 'activeModal', activeModal );

/**
 * Persistent. Sets the sandbox mode on or off.
 *
 * @param {boolean} useSandbox
 * @param {string}  source     Optional source context for tracking.
 * @return {Action} The action.
 */
export const setSandboxMode = ( useSandbox, source ) => {
	return setPersistent( 'useSandbox', useSandbox, source );
};

/**
 * Persistent. Toggles the "Manual Connection" mode on or off.
 *
 * @param {boolean} useManualConnection
 * @param {string}  source              Optional source context for tracking.
 * @return {Action} The action.
 */
export const setManualConnectionMode = ( useManualConnection, source ) =>
	setPersistent( 'useManualConnection', useManualConnection, source );

/**
 * Persistent. Changes the "webhooks" value.
 *
 * @param {string} webhooks
 * @return {Action} The action.
 */
export const setWebhooks = ( webhooks ) =>
	setPersistent( 'webhooks', webhooks );

/**
 * Replace merchant details in the store.
 *
 * @param {Object} merchant - The new merchant details.
 * @return {Action} The action.
 */
export const setMerchant = ( merchant ) => ( {
	type: ACTION_TYPES.SET_MERCHANT,
	payload: { merchant },
} );

/**
 * Reset merchant details in the store.
 *
 * @return {Action} The action.
 */
export const resetMerchant = () => ( { type: ACTION_TYPES.RESET_MERCHANT } );

// Activity control - see useBusyState() hook.

/**
 * Transient (Activity): Marks the start of an async activity
 * Think of it as "setIsBusy(true)"
 *
 * @param {string}  id          Internal ID/key of the action, used to stop it again.
 * @param {?string} description Optional, description for logging/debugging
 * @return {?Action} The action.
 */
export const startActivity = ( id, description = null ) => {
	if ( ! id || 'string' !== typeof id ) {
		console.warn( 'Activity ID must be a non-empty string' );
		return null;
	}

	return {
		type: ACTION_TYPES.START_ACTIVITY,
		payload: { id, description },
	};
};

/**
 * Transient (Activity): Marks the end of an async activity.
 * Think of it as "setIsBusy(false)"
 *
 * @param {string} id Internal ID/key of the action, used to stop it again.
 * @return {Action} The action.
 */
export const stopActivity = ( id ) => ( {
	type: ACTION_TYPES.STOP_ACTIVITY,
	payload: { id },
} );

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
