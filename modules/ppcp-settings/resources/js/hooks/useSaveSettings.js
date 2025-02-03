import { useCallback } from '@wordpress/element';

import {
	CommonHooks,
	PaymentHooks,
	SettingsHooks,
	StylingHooks,
	TodosHooks,
} from '../data';

export const useSaveSettings = () => {
	const { withActivity } = CommonHooks.useBusyState();

	const { persist: persistPayment } = PaymentHooks.useStore();
	const { persist: persistSettings } = SettingsHooks.useStore();
	const { persist: persistStyling } = StylingHooks.useStore();
	const { persist: persistTodos } = TodosHooks.useStore();

	const persistAll = useCallback( () => {
		withActivity(
			'persist-methods',
			'Save payment methods',
			persistPayment
		);
		withActivity(
			'persist-settings',
			'Save the settings',
			persistSettings
		);
		withActivity(
			'persist-styling',
			'Save styling details',
			persistStyling
		);
		withActivity( 'persist-todos', 'Save todos state', persistTodos );
	}, [
		persistPayment,
		persistSettings,
		persistStyling,
		persistTodos,
		withActivity,
	] );

	return { persistAll };
};
