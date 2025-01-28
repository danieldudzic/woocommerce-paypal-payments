import { useCallback } from '@wordpress/element';

import {
	CommonHooks,
	PaymentHooks,
	SettingsHooks,
	StylingHooks,
} from '../data';

export const useSaveSettings = () => {
	const { withActivity } = CommonHooks.useBusyState();

	const { persist: persistPayment } = PaymentHooks.useStore();
	const { persist: persistSettings } = SettingsHooks.useStore();
	const { persist: persistStyling } = StylingHooks.useStore();

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
	}, [ persistPayment, persistSettings, persistStyling, withActivity ] );

	return { persistAll };
};
