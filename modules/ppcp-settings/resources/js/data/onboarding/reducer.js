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
	manualClientId: '',
	manualClientSecret: '',
	connectionButtonClicked: false,
	fieldSources: Object.freeze( {} ),

	// Read only values, provided by the server.
	flags: Object.freeze( {
		canUseCasualSelling: false,
		canUseVaulting: false,
		canUseCardPayments: false,
		canUseSubscriptions: false,
		shouldSkipPaymentMethods: false,
		canUseFastlane: false,
		canUsePayLater: false,
	} ),
} );

const defaultPersistent = Object.freeze( {
	completed: false,
	step: 0,
	isCasualSeller: null, // null value will uncheck both options in the UI.
	areOptionalPaymentMethodsEnabled: null,
	products: [],
	gatewaysSynced: false,
	gatewaysRefreshed: false,
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

const onboardingReducer = createReducer( defaultTransient, defaultPersistent, {
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
		cleanState.flags = { ...state.flags };
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

		// Flags are not updated by `changePersistent()`.
		if ( payload.flags ) {
			newState.flags = Object.freeze( {
				...newState.flags,
				...payload.flags,
			} );
		}

		return newState;
	},

	[ ACTION_TYPES.SYNC_GATEWAYS ]: ( state, payload, action ) => {
		const newState = changePersistent( state, { gatewaysSynced: true } );

		if ( action && action.source ) {
			newState.fieldSources = updateFieldSources(
				newState.fieldSources,
				'gatewaysSynced',
				action.source
			);
		}

		return newState;
	},

	[ ACTION_TYPES.REFRESH_GATEWAYS ]: ( state, payload, action ) => {
		const newState = changePersistent( state, { gatewaysRefreshed: true } );

		if ( action ) {
			if ( action.source ) {
				newState.fieldSources = updateFieldSources(
					newState.fieldSources,
					'gatewaysRefreshed',
					action.source
				);
			}
		}

		return newState;
	},
} );

export default onboardingReducer;
