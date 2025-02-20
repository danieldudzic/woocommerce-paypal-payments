/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { useSelect, useDispatch } from '@wordpress/data';

import { createHooksForStore } from '../utils';
import { PRODUCT_TYPES } from './configuration';
import { STORE_NAME } from './constants';
import { useMemo } from '@wordpress/element';

/**
 * Single source of truth for access Redux details.
 *
 * This hook returns a stable API to access actions, selectors and special hooks to generate
 * getter- and setters for transient or persistent properties.
 *
 * @return {{select, dispatch, useTransient, usePersistent}} Store data API.
 */
const useStoreData = () => {
	const select = useSelect( ( selectors ) => selectors( STORE_NAME ), [] );
	const dispatch = useDispatch( STORE_NAME );
	const { useTransient, usePersistent } = createHooksForStore( STORE_NAME );

	return useMemo(
		() => ( {
			select,
			dispatch,
			useTransient,
			usePersistent,
		} ),
		[ select, dispatch, useTransient, usePersistent ]
	);
};

const useHooks = () => {
	const { useTransient, usePersistent } = createHooksForStore( STORE_NAME );
	const { persist } = useDispatch( STORE_NAME );

	// Read-only flags and derived state.
	const flags = useSelect( ( select ) => select( STORE_NAME ).flags(), [] );

	// Transient accessors.
	const [ isReady ] = useTransient( 'isReady' );
	const [ manualClientId, setManualClientId ] =
		useTransient( 'manualClientId' );
	const [ manualClientSecret, setManualClientSecret ] =
		useTransient( 'manualClientSecret' );

	// Persistent accessors.
	const [ step, setStep ] = usePersistent( 'step' );
	const [ completed, setCompleted ] = usePersistent( 'completed' );
	const [ isCasualSeller, setIsCasualSeller ] =
		usePersistent( 'isCasualSeller' );
	const [ optionalMethods, setOptionalMethods ] = usePersistent(
		'areOptionalPaymentMethodsEnabled'
	);
	const [ products, setProducts ] = usePersistent( 'products' );

	const savePersistent = async ( setter, value ) => {
		setter( value );
		await persist();
	};

	return {
		flags,
		isReady,
		step,
		setStep: ( value ) => {
			return savePersistent( setStep, value );
		},
		completed,
		setCompleted: ( state ) => {
			return savePersistent( setCompleted, state );
		},
		isCasualSeller,
		setIsCasualSeller: ( value ) => {
			return savePersistent( setIsCasualSeller, value );
		},
		manualClientId,
		setManualClientId: ( value ) => {
			return savePersistent( setManualClientId, value );
		},
		manualClientSecret,
		setManualClientSecret: ( value ) => {
			return savePersistent( setManualClientSecret, value );
		},
		optionalMethods,
		setOptionalMethods: ( value ) => {
			return savePersistent( setOptionalMethods, value );
		},
		products,
		setProducts: ( activeProducts ) => {
			const validProducts = activeProducts.filter( ( item ) =>
				Object.values( PRODUCT_TYPES ).includes( item )
			);
			return savePersistent( setProducts, validProducts );
		},
	};
};

export const useManualConnectionForm = () => {
	const {
		manualClientId,
		setManualClientId,
		manualClientSecret,
		setManualClientSecret,
	} = useHooks();

	return {
		manualClientId,
		setManualClientId,
		manualClientSecret,
		setManualClientSecret,
	};
};

export const useBusiness = () => {
	const { isCasualSeller, setIsCasualSeller } = useHooks();

	return { isCasualSeller, setIsCasualSeller };
};

export const useProducts = () => {
	const { products, setProducts } = useHooks();

	return { products, setProducts };
};

export const useOptionalPaymentMethods = () => {
	const { optionalMethods, setOptionalMethods } = useHooks();

	return {
		optionalMethods,
		setOptionalMethods,
	};
};

export const useSteps = () => {
	const { flags, isReady, step, setStep, completed, setCompleted } =
		useHooks();

	return { flags, isReady, step, setStep, completed, setCompleted };
};

export const useNavigationState = () => {
	const products = useProducts();
	const business = useBusiness();
	const methods = useOptionalPaymentMethods();

	return {
		products,
		business,
		methods,
	};
};

export const useDetermineProducts = () => {
	const { select } = useStoreData();
	const { determineProductsAndCaps } = select;

	return determineProductsAndCaps;
};

export const useFlags = () => {
	const { flags } = useHooks();
	return flags;
};
