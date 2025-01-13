/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { useSelect, useDispatch } from '@wordpress/data';

import { STORE_NAME } from './constants';

const useTransient = ( key ) =>
	useSelect(
		( select ) => select( STORE_NAME ).transientData()?.[ key ],
		[ key ]
	);

const usePersistent = ( key ) =>
	useSelect(
		( select ) => select( STORE_NAME ).persistentData()?.[ key ],
		[ key ]
	);

const useHooks = () => {
	const {
		persist,

		// TODO: Replace with real property.
		setSampleValue,
	} = useDispatch( STORE_NAME );

	// Read-only flags and derived state.
	// Nothing here yet.

	// Transient accessors.
	const isReady = useTransient( 'isReady' );

	// Persistent accessors.
	// TODO: Replace with real property.
	const sampleValue = usePersistent( 'sampleValue' );

	return {
		persist,
		isReady,
		sampleValue,
		setSampleValue,
	};
};

export const useState = () => {
	const { persist, isReady } = useHooks();
	return { persist, isReady };
};

// TODO: Replace with real hook.
export const useSampleValue = () => {
	const { sampleValue, setSampleValue } = useHooks();

	return {
		sampleValue,
		setSampleValue,
	};
};
