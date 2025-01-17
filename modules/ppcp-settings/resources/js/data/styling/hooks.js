/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { __, sprintf } from '@wordpress/i18n';
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
	const { useTransient } = createHooksForStore( STORE_NAME );
	const { persist, setPersistent } = useDispatch( STORE_NAME );

	// Read-only flags and derived state.

	// Transient accessors.
	const [ isReady ] = useTransient( 'isReady' );
	const [ location, setLocation ] = useTransient( 'location' );

	// Persistent accessors.
	const persistentData = useSelect(
		( select ) => select( STORE_NAME ).persistentData(),
		[]
	);

	const getLocationProp = useCallback(
		( locatonId, prop ) => {
			if ( undefined === persistentData[ locatonId ]?.[ prop ] ) {
				console.error(
					`Trying to access non-existent style property: ${ locatonId }.${ prop }. Possibly wrong style name - review the reducer.`
				);
			}
			return persistentData[ locatonId ]?.[ prop ];
		},
		[ persistentData ]
	);

	const setLocationProp = useCallback(
		( locationId, prop, value ) => {
			const updatedStyles = {
				...persistentData[ locationId ],
				[ prop ]: value,
			};

			setPersistent( locationId, updatedStyles );
		},
		[ persistentData, setPersistent ]
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

export const useLocationProps = ( location ) => {
	const details = STYLING_LOCATIONS[ location ] ?? {};

	return {
		choices: Object.values( STYLING_LOCATIONS ),
		details,
	};
};

export const usePaymentMethodProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();

	return {
		choices: Object.values( STYLING_PAYMENT_METHODS ),
		paymentMethods: getLocationProp( location, 'methods' ),
		setPaymentMethods: ( methods ) =>
			setLocationProp( location, 'methods', methods ),
	};
};

export const useColorProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();

	return {
		choices: Object.values( STYLING_COLORS ),
		color: getLocationProp( location, 'color' ),
		setColor: ( color ) => setLocationProp( location, 'color', color ),
	};
};

export const useShapeProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();

	return {
		choices: Object.values( STYLING_SHAPES ),
		shape: getLocationProp( location, 'shape' ),
		setShape: ( shape ) => setLocationProp( location, 'shape', shape ),
	};
};

export const useLabelProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();

	return {
		choices: Object.values( STYLING_LABELS ),
		label: getLocationProp( location, 'label' ),
		setLabel: ( label ) => setLocationProp( location, 'label', label ),
	};
};

export const useLayoutProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();
	const { details } = useLocationProps( location );
	const isAvailable = false !== details.props.layout;

	return {
		choices: Object.values( STYLING_LAYOUTS ),
		isAvailable,
		layout: getLocationProp( location, 'layout' ),
		setLayout: ( layout ) => setLocationProp( location, 'layout', layout ),
	};
};

export const useTaglineProps = ( location ) => {
	const { getLocationProp, setLocationProp } = useHooks();
	const { details } = useLocationProps( location );

	// Tagline is only available for horizontal layouts.
	const isAvailable =
		false !== details.props.tagline &&
		STYLING_LAYOUTS.horizontal.value ===
			getLocationProp( location, 'layout' );

	return {
		isAvailable,
		tagline: isAvailable ? getLocationProp( location, 'tagline' ) : false,
		setTagline: ( tagline ) =>
			setLocationProp( location, 'tagline', tagline ),
	};
};
