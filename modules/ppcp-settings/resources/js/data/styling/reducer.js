/**
 * Reducer: Defines store structure and state updates for this module.
 *
 * Manages both transient (temporary) and persistent (saved) state.
 * The initial state must define all properties, as dynamic additions are not supported.
 *
 * @file
 */

import { createReducer, createSetters } from '../utils';
import ACTION_TYPES from './action-types';
import { STYLING_COLORS, STYLING_SHAPES } from './configuration';

// Store structure.

// Transient: Values that are _not_ saved to the DB (like app lifecycle-flags).
const defaultTransient = Object.freeze( {
	isReady: false,
} );

// Persistent: Values that are loaded from the DB.
const defaultPersistent = Object.freeze( {
	cart: {
		enabled: true,
		methods: [],
		label: 'Pay',
		shape: STYLING_SHAPES.rect.value,
		color: STYLING_COLORS.gold.value,
	},
	'classic-checkout': {
		enabled: true,
		methods: [],
		label: 'Checkout',
		shape: STYLING_SHAPES.rect.value,
		color: STYLING_COLORS.gold.value,
	},
	'express-checkout': {
		enabled: true,
		methods: [],
		label: 'Checkout',
		shape: STYLING_SHAPES.rect.value,
		color: STYLING_COLORS.gold.value,
	},
	'mini-cart': {
		enabled: true,
		methods: [],
		label: 'Pay',
		shape: STYLING_SHAPES.rect.value,
		color: STYLING_COLORS.gold.value,
	},
	product: {
		enabled: true,
		methods: [],
		label: 'Buy',
		shape: STYLING_SHAPES.rect.value,
		color: STYLING_COLORS.gold.value,
	},
} );

// Reducer logic.

const [ setTransient, setPersistent ] = createSetters(
	defaultTransient,
	defaultPersistent
);

const reducer = createReducer( defaultTransient, defaultPersistent, {
	[ ACTION_TYPES.SET_TRANSIENT ]: ( state, payload ) =>
		setTransient( state, payload ),

	[ ACTION_TYPES.SET_PERSISTENT ]: ( state, payload ) =>
		setPersistent( state, payload ),

	[ ACTION_TYPES.RESET ]: ( state ) => {
		const cleanState = setTransient(
			setPersistent( state, defaultPersistent ),
			defaultTransient
		);

		// Keep "read-only" details and initialization flags.
		cleanState.isReady = true;

		return cleanState;
	},

	[ ACTION_TYPES.HYDRATE ]: ( state, payload ) =>
		setPersistent( state, payload.data ),
} );

export default reducer;
