/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */
import { useDispatch } from '@wordpress/data';

import { STORE_NAME } from './constants';
import { createHooksForStore } from '../utils';

const useHooks = () => {
	const { useTransient, usePersistent } = createHooksForStore( STORE_NAME );
	const { persist } = useDispatch( STORE_NAME );

	// Read-only flags and derived state.
	const [ isReady ] = useTransient( 'isReady' );

	// Persistent accessors.
	const [ settings, setSettings ] = usePersistent( 'settings' );

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
