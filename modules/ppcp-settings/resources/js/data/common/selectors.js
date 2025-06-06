/**
 * Selectors: Extract specific pieces of state from the store.
 *
 * These functions provide a consistent interface for accessing store data.
 * They allow components to retrieve data without knowing the store structure.
 *
 * @file
 */

const EMPTY_OBJ = Object.freeze( {} );

const getState = ( state ) => state || EMPTY_OBJ;

export const persistentData = ( state ) => {
	return getState( state ).data || EMPTY_OBJ;
};

export const transientData = ( state ) => {
	const {
		data,
		merchant,
		features,
		wooSettings,
		webhooks,
		...transientState
	} = getState( state );
	return transientState || EMPTY_OBJ;
};

export const getActivityList = ( state ) => {
	const { activities = new Map() } = state;
	return Object.fromEntries( activities );
};

/**
 * Get the source information for a specific field.
 * @param {Object} state     - Store state
 * @param {string} fieldName
 */
export const getFieldSource = ( state, fieldName ) => {
	const fieldSources = state?.fieldSources || {};
	const fieldSource = fieldSources[ fieldName ];

	if ( ! fieldSource ) {
		return null;
	}

	return fieldSource;
};

/**
 * Get all field sources for debugging.
 * @param {Object} state - Store state
 * @return {Object} All field source information
 */
export const getAllFieldSources = ( state ) => {
	const currentState = getState( state );
	return currentState.fieldSources || {};
};

export const merchant = ( state ) => {
	return getState( state ).merchant || EMPTY_OBJ;
};

export const features = ( state ) => {
	return getState( state ).features || EMPTY_OBJ;
};

export const wooSettings = ( state ) => {
	const settings = getState( state ).wooSettings || EMPTY_OBJ;

	// For development and testing. Remove this eventually!
	const simulateBrandedOnly = document.cookie
		.split( '; ' )
		.find( ( row ) => row.startsWith( 'simulate-branded-only=' ) )
		?.split( '=' )[ 1 ];

	/**
	 * The "own-brand-only" experience is determined on server-side, based on the installation path.
	 *
	 * When true, the plugin must only display "PayPal's own brand" payment options
	 * i.e. no card payments or Apple Pay/Google Pay.
	 *
	 * @type {boolean}
	 */
	const ownBrandOnly =
		'true' === simulateBrandedOnly || settings.ownBrandOnly;

	return { ...settings, ownBrandOnly };
};

export const webhooks = ( state ) => {
	return getState( state ).webhooks || EMPTY_OBJ;
};
