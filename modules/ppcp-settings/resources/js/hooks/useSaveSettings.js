import { useCallback, useMemo } from '@wordpress/element';

import {
	CommonHooks,
	PayLaterMessagingHooks,
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
	const { persist: persistPayLaterMessaging } =
		PayLaterMessagingHooks.useStore();

	const persistActions = useMemo(
		() => [
			{
				key: 'persist-methods',
				message: 'Save payment methods',
				action: persistPayment,
			},
			{
				key: 'persist-settings',
				message: 'Save the settings',
				action: persistSettings,
			},
			{
				key: 'persist-styling',
				message: 'Save styling details',
				action: persistStyling,
			},
			{
				key: 'persist-todos',
				message: 'Save todos state',
				action: persistTodos,
			},
			{
				key: 'persist-pay-later-messaging',
				message: 'Save pay later messaging details',
				action: persistPayLaterMessaging,
			},
		],
		[
			persistPayLaterMessaging,
			persistPayment,
			persistSettings,
			persistStyling,
			persistTodos,
		]
	);

	const persistAll = useCallback( () => {
		/**
		 * Executes onSave on TabPayLaterMessaging component.
		 *
		 * Todo: find a better way for this, because it's highly unreliable
		 *       (it only works when the user is still on the "Pay Later Messaging" tab)
		 */
		document.getElementById( 'configurator-publishButton' )?.click();

		persistActions.forEach( ( { key, message, action } ) => {
			withActivity( key, message, action );
		} );
	}, [ persistActions, withActivity ] );

	return { persistAll };
};
