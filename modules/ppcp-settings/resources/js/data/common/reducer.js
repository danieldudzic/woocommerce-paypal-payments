/**
 * Reducer: Defines store structure and state updates for this module.
 *
 * Manages both transient (temporary) and persistent (saved) state.
 * The initial state must define all properties, as dynamic additions are not supported.
 *
 * @file
 */

import { createReducer, createReducerSetters } from '../utils';
import ACTION_TYPES from './action-types';

// Store structure.

const defaultTransient = Object.freeze( {
	isReady: false,
	activities: new Map(),
	activeModal: '',
	activeHighlight: '',
	fieldSources: Object.freeze( {} ),

	// Read only values, provided by the server via hydrate.
	merchant: Object.freeze( {
		isConnected: false,
		isSandbox: false,
		id: '',
		email: '',
		clientId: '',
		clientSecret: '',
		sellerType: 'unknown',
	} ),

	wooSettings: Object.freeze( {
		storeCountry: '',
		storeCurrency: '',

		/**
		 * The "branded-only" experience is determined on server-side, based on the installation path.
		 *
		 * When true, the plugin must only display "PayPal's own brand" payment options
		 * i.e. no card payments or Apple Pay/Google Pay.
		 *
		 * @type {boolean}
		 */
		ownBrandOnly: false,
	} ),

	features: Object.freeze( {
		save_paypal_and_venmo: {
			enabled: false,
		},
		advanced_credit_and_debit_cards: {
			enabled: false,
		},
		apple_pay: {
			enabled: false,
		},
		google_pay: {
			enabled: false,
		},
		alternative_payment_methods: {
			enabled: false,
		},
		pay_later_messaging: {
			enabled: false,
		},
	} ),

	webhooks: Object.freeze( [] ),
} );

const defaultPersistent = Object.freeze( {
	useSandbox: false,
	useManualConnection: false,
} );

const updateFieldSources = ( currentSources, fieldName, source ) => {
	if ( ! source ) {
		return currentSources;
	}

	return {
		...currentSources,
		[ fieldName ]: {
			source,
			timestamp: Date.now(),
		},
	};
};

const clearFieldSource = ( currentSources, fieldName ) => {
	const newSources = { ...currentSources };
	delete newSources[ fieldName ];
	return newSources;
};

// Reducer logic.
const [ changeTransient, changePersistent ] = createReducerSetters(
	defaultTransient,
	defaultPersistent
);

const commonReducer = createReducer( defaultTransient, defaultPersistent, {
	[ ACTION_TYPES.SET_TRANSIENT ]: ( state, payload, action ) => {
		const newState = changeTransient( state, payload );

		if ( action && action.source ) {
			const fieldName = Object.keys( payload )[ 0 ];

			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				fieldName,
				action.source
			);
		}

		return newState;
	},

	[ ACTION_TYPES.SET_PERSISTENT ]: ( state, payload, action ) => {
		const newState = changePersistent( state, payload );

		if ( action && action.source ) {
			const fieldName = Object.keys( payload )[ 0 ];

			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				fieldName,
				action.source
			);
		}

		return newState;
	},

	[ ACTION_TYPES.CLEAR_FIELD_SOURCE ]: ( state, payload ) => {
		const newState = { ...state };
		newState.fieldSources = clearFieldSource(
			newState.fieldSources,
			payload.fieldName
		);

		return newState;
	},

	[ ACTION_TYPES.RESET ]: ( state, payload, action ) => {
		const cleanState = changeTransient(
			changePersistent( state, defaultPersistent ),
			defaultTransient
		);

		// Keep "read-only" details and initialization flags.
		cleanState.wooSettings = { ...state.wooSettings };
		cleanState.merchant = { ...state.merchant };
		cleanState.features = { ...state.features };
		cleanState.isReady = true;

		if ( action && action.source ) {
			cleanState.fieldSources = updateFieldSources(
				cleanState.fieldSources,
				'reset',
				action.source
			);
		}

		return cleanState;
	},

	[ ACTION_TYPES.START_ACTIVITY ]: ( state, payload, action ) => {
		const newState = changeTransient( state, {
			activities: new Map( state.activities ).set(
				payload.id,
				payload.description
			),
		} );

		if ( action && action.source ) {
			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				'activity_' + payload.id,
				action.source
			);
		}

		return newState;
	},

	[ ACTION_TYPES.STOP_ACTIVITY ]: ( state, payload, action ) => {
		const newActivities = new Map( state.activities );
		newActivities.delete( payload.id );
		const newState = changeTransient( state, {
			activities: newActivities,
		} );

		if ( action && action.source ) {
			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				'activity_stop_' + payload.id,
				action.source
			);
		}

		return newState;
	},

	// Instantly reset the merchant data and features before refreshing the details.
	[ ACTION_TYPES.RESET_MERCHANT ]: ( state, payload, action ) => {
		const newState = {
			...state,
			merchant: Object.freeze( { ...defaultTransient.merchant } ),
			features: Object.freeze( { ...defaultTransient.features } ),
		};

		if ( action && action.source ) {
			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				'reset_merchant',
				action.source
			);
		}

		return newState;
	},

	[ ACTION_TYPES.SET_MERCHANT ]: ( state, payload, action ) => {
		const newState = changePersistent( state, {
			merchant: payload.merchant,
		} );

		if ( action && action.source ) {
			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				'merchant',
				action.source
			);
		}

		return newState;
	},

	[ ACTION_TYPES.HYDRATE ]: ( state, payload, action ) => {
		let newState = { ...state };

		if ( action && action.source && payload.data ) {
			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				'hydrate',
				action.source
			);

			Object.keys( payload.data ).forEach( ( fieldName ) => {
				newState.fieldSources = updateFieldSources(
					newState.fieldSources,
					fieldName,
					action.source
				);
			} );
		}

		newState = changePersistent( newState, payload.data );

		// Populate read-only properties.
		[ 'wooSettings', 'merchant', 'features', 'webhooks' ].forEach(
			( key ) => {
				if ( ! payload[ key ] ) {
					return;
				}

				newState[ key ] = Object.freeze( {
					...newState[ key ],
					...payload[ key ],
				} );
			}
		);

		return newState;
	},
} );

export default commonReducer;
