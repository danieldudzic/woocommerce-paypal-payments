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
	const { persist, setSettings } = useDispatch( STORE_NAME );

	// Read-only flags and derived state.
	const isReady = useTransient( 'isReady' );

	// Persistent accessors.
	const settings = useSelect(
		( select ) => select( STORE_NAME ).persistentData(),
		[]
	);

	return {
		persist,
		isReady,
		settings,
		setSettings,
	};
};

export const useStore = () => {
	const { persist, isReady } = useHooks();
	return { persist, isReady };
};

export const useSettings = () => {
	const { settings, setSettings } = useHooks();
	return {
		settings,
		setSettings,
	};
};
