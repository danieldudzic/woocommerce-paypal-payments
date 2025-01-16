/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element'; // Temporary
import { useDispatch } from '@wordpress/data';

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
	const [ shape, setShape ] = usePersistent( 'shape' );

	return {
		persist,
		isReady,
		location,
		setLocation,
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
	const defaultStyle = {
		paymentMethods: [],
		color: 'gold',
		shape: 'rect',
		label: 'paypal',
		layout: 'vertical',
		tagline: false,
	};

	const [ styles, setStyles ] = useState( {
		cart: { ...defaultStyle, label: 'checkout' },
		'classic-checkout': { ...defaultStyle },
		'express-checkout': { ...defaultStyle, label: 'pay' },
		'mini-cart': { ...defaultStyle, label: 'pay' },
		'product-page': { ...defaultStyle },
	} );

	const getLocationStyle = useCallback(
		( prop ) => styles[ location ]?.[ prop ],
		[ location, styles ]
	);

	const setLocationStyle = useCallback(
		( prop, value ) => {
			setStyles( ( prevState ) => ( {
				...prevState,
				[ location ]: {
					...prevState[ location ],
					[ prop ]: value,
				},
			} ) );
		},
		[ location ]
	);

	return {
		// Location (drop down).
		locationChoices: Object.values( STYLING_LOCATIONS ),
		locationDetails: STYLING_LOCATIONS[ location ],

		// Payment methods (checkboxes).
		paymentMethodChoices: Object.values( STYLING_PAYMENT_METHODS ),
		paymentMethods: getLocationStyle( 'paymentMethods' ),
		setPaymentMethods: ( methods ) =>
			setLocationStyle( 'paymentMethods', methods ),

		// Color (dropdown).
		colorChoices: Object.values( STYLING_COLORS ),
		color: getLocationStyle( 'color' ),
		setColor: ( color ) => setLocationStyle( 'color', color ),

		// Shape (radio).
		shapeChoices: Object.values( STYLING_SHAPES ),
		shape: getLocationStyle( 'shape' ),
		setShape: ( shape ) => setLocationStyle( 'shape', shape ),

		// Label (dropdown).
		labelChoices: Object.values( STYLING_LABELS ),
		label: getLocationStyle( 'label' ),
		setLabel: ( label ) => setLocationStyle( 'label', label ),

		// Layout (radio).
		layoutChoices: Object.values( STYLING_LAYOUTS ),
		supportsLayout: true,
		layout: getLocationStyle( 'layout' ),
		setLayout: ( layout ) => setLocationStyle( 'layout', layout ),

		// Tagline (checkbox).
		taglineChoices: [
			{
				value: 'tagline',
				label: __( 'Enable Tagline', 'woocommerce-paypal-payments' ),
			},
		],
		supportsTagline: true,
		tagline: getLocationStyle( 'tagline' ),
		setTagline: ( tagline ) => setLocationStyle( 'tagline', tagline ),
	};
};
