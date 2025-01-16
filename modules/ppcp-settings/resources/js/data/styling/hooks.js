/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element'; // Temporary
import { useDispatch, useSelect } from '@wordpress/data';

import { createHooksForStore } from '../utils';
import { STORE_NAME } from './constants';
import {
	STYLING_COLORS,
	STYLING_LABELS,
	STYLING_LAYOUTS,
	STYLING_LOCATIONS,
	STYLING_PAYMENT_METHODS,
	STYLING_SHAPES,
} from './configuration';

const useHooks = () => {
	const { useTransient, usePersistent } = createHooksForStore( STORE_NAME );
	const { persist } = useDispatch( STORE_NAME );

	// Read-only flags and derived state.

	// Transient accessors.
	const [ isReady ] = useTransient( 'isReady' );
	const [ location, setLocation ] = useTransient( 'location' );

	// Persistent accessors.
	const persistentData = useSelect(
		( select ) => select( STORE_NAME ).persistentData(),
		[]
	);

	const [ locationStyles, setLocationStyles ] = usePersistent( location );

	const getLocationProp = useCallback(
		( prop ) => {
			return persistentData[ location ]?.[ prop ];
		},
		[ location, persistentData ]
	);

	const setLocationProp = useCallback(
		( prop, value ) => {
			setLocationStyles( {
				...locationStyles,
				[ prop ]: value,
			} );
		},
		[ locationStyles, setLocationStyles ]
	);

	return {
		persist,
		isReady,
		location,
		setLocation,
		getLocationProp,
		setLocationProp,
	};
};

export const useStore = () => {
	const { persist, isReady } = useHooks();
	return { persist, isReady };
};

export const useStylingLocation = () => {
	const { location, setLocation } = useHooks();
	return { location, setLocation };
};

export const useStylingProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();

	return {
		// Location (drop down).
		locationChoices: Object.values( STYLING_LOCATIONS ),
		locationDetails: STYLING_LOCATIONS[ location ],

		// Payment methods (checkboxes).
		paymentMethodChoices: Object.values( STYLING_PAYMENT_METHODS ),
		paymentMethods: getLocationProp( 'paymentMethods' ),
		setPaymentMethods: ( methods ) =>
			setLocationProp( 'paymentMethods', methods ),

		// Color (dropdown).
		colorChoices: Object.values( STYLING_COLORS ),
		color: getLocationProp( 'color' ),
		setColor: ( color ) => setLocationProp( 'color', color ),

		// Shape (radio).
		shapeChoices: Object.values( STYLING_SHAPES ),
		shape: getLocationProp( 'shape' ),
		setShape: ( shape ) => setLocationProp( 'shape', shape ),

		// Label (dropdown).
		labelChoices: Object.values( STYLING_LABELS ),
		label: getLocationProp( 'label' ),
		setLabel: ( label ) => setLocationProp( 'label', label ),

		// Layout (radio).
		layoutChoices: Object.values( STYLING_LAYOUTS ),
		supportsLayout: true,
		layout: getLocationProp( 'layout' ),
		setLayout: ( layout ) => setLocationProp( 'layout', layout ),

		// Tagline (checkbox).
		taglineChoices: [
			{
				value: 'tagline',
				label: __( 'Enable Tagline', 'woocommerce-paypal-payments' ),
			},
		],
		supportsTagline: true,
		tagline: getLocationProp( 'tagline' ),
		setTagline: ( tagline ) => setLocationProp( 'tagline', tagline ),
	};
};
