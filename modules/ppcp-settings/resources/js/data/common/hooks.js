/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';

import { createHooksForStore } from '../utils';
import { STORE_NAME } from './constants';

const useHooks = () => {
	const { useTransient, usePersistent } = createHooksForStore( STORE_NAME );
	const {
		persist,
		sandboxOnboardingUrl,
		productionOnboardingUrl,
		authenticateWithCredentials,
		authenticateWithOAuth,
		startWebhookSimulation,
		checkWebhookSimulationState,
	} = useDispatch( STORE_NAME );

	// Transient accessors.
	const [ isReady ] = useTransient( 'isReady' );
	const [ activeModal, setActiveModal ] = useTransient( 'activeModal' );
	const [ activeHighlight, setActiveHighlight ] =
		useTransient( 'activeHighlight' );

	// Persistent accessors.
	const [ isSandboxMode, setSandboxMode ] = usePersistent( 'useSandbox' );
	const [ isManualConnectionMode, setManualConnectionMode ] = usePersistent(
		'useManualConnection'
	);
	const merchant = useSelect(
		( select ) => select( STORE_NAME ).merchant(),
		[]
	);

	// Read-only properties.
	const wooSettings = useSelect(
		( select ) => select( STORE_NAME ).wooSettings(),
		[]
	);
	const features = useSelect(
		( select ) => select( STORE_NAME ).features(),
		[]
	);
	const webhooks = useSelect(
		( select ) => select( STORE_NAME ).webhooks(),
		[]
	);

	const savePersistent = async ( setter, value ) => {
		setter( value );
		await persist();
	};

	return {
		isReady,
		activeModal,
		setActiveModal,
		activeHighlight,
		setActiveHighlight,
		isSandboxMode,
		setSandboxMode: ( state ) => {
			return savePersistent( setSandboxMode, state );
		},
		isManualConnectionMode,
		setManualConnectionMode: ( state ) => {
			return savePersistent( setManualConnectionMode, state );
		},
		sandboxOnboardingUrl,
		productionOnboardingUrl,
		authenticateWithCredentials,
		authenticateWithOAuth,
		merchant,
		wooSettings,
		features,
		webhooks,
		startWebhookSimulation,
		checkWebhookSimulationState,
	};
};

export const useSandbox = () => {
	const { isSandboxMode, setSandboxMode, sandboxOnboardingUrl } = useHooks();

	return { isSandboxMode, setSandboxMode, sandboxOnboardingUrl };
};

export const useProduction = () => {
	const { productionOnboardingUrl } = useHooks();

	return { productionOnboardingUrl };
};

export const useAuthentication = () => {
	const {
		isManualConnectionMode,
		setManualConnectionMode,
		authenticateWithCredentials,
		authenticateWithOAuth,
	} = useHooks();

	return {
		isManualConnectionMode,
		setManualConnectionMode,
		authenticateWithCredentials,
		authenticateWithOAuth,
	};
};

export const useDisconnectMerchant = () => {
	const { disconnectMerchant } = useDispatch( STORE_NAME );
	return { disconnectMerchant };
};

export const useWooSettings = () => {
	const { wooSettings } = useHooks();

	return wooSettings;
};

export const useWebhooks = () => {
	const {
		webhooks,
		setWebhooks,
		registerWebhooks,
		startWebhookSimulation,
		checkWebhookSimulationState,
	} = useHooks();
	return {
		webhooks,
		setWebhooks,
		registerWebhooks,
		startWebhookSimulation,
		checkWebhookSimulationState,
	};
};

export const useMerchantInfo = () => {
	const { isReady, merchant, features } = useHooks();
	const { refreshMerchantData, setMerchant } = useDispatch( STORE_NAME );

	const verifyLoginStatus = useCallback( async () => {
		const result = await refreshMerchantData();

		if ( ! result.success || ! result.merchant ) {
			throw new Error( result?.message || result?.error?.message );
		}

		const newMerchant = result.merchant;

		// Verify if the server state is "connected" and we have a merchant ID.
		if ( newMerchant?.isConnected && newMerchant?.id ) {
			// Update the verified merchant details in Redux.
			setMerchant( newMerchant );

			return true;
		}

		return false;
	}, [ refreshMerchantData, setMerchant ] );

	return {
		isReady,
		merchant, // Merchant details
		features, // Eligible merchant features
		verifyLoginStatus, // Callback
	};
};

export const useActiveModal = () => {
	const { activeModal, setActiveModal } = useHooks();
	return { activeModal, setActiveModal };
};

export const useActiveHighlight = () => {
	const { activeHighlight, setActiveHighlight } = useHooks();
	return { activeHighlight, setActiveHighlight };
};

// -- Not using the `useHooks()` data provider --

export const useBusyState = () => {
	const { startActivity, stopActivity } = useDispatch( STORE_NAME );

	// Resolved value (object), contains a list of all running actions.
	const activities = useSelect(
		( select ) => select( STORE_NAME ).getActivityList(),
		[]
	);

	// Derive isBusy state from activities
	const isBusy = Object.keys( activities ).length > 0;

	// HOC that starts and stops an activity while the callback is executed.
	const withActivity = useCallback(
		async ( id, description, asyncFn ) => {
			startActivity( id, description );

			// Intentionally does not catch errors but propagates them to the calling module.
			try {
				return await asyncFn();
			} finally {
				stopActivity( id );
			}
		},
		[ startActivity, stopActivity ]
	);

	return {
		withActivity, // HOC
		isBusy, // Boolean.
	};
};

export const useActivityObserver = () => {
	const activities = useSelect(
		( select ) => select( STORE_NAME ).getActivityList(),
		[]
	);

	const [ prevActivities, setPrevActivities ] = useState( activities );

	useEffect( () => {
		setPrevActivities( activities );
	}, [ activities ] );

	const onStarted = useCallback(
		( callback ) => {
			const newActivities = Object.keys( activities ).filter(
				( id ) => ! prevActivities[ id ]
			);
			if ( ! newActivities.length ) {
				return;
			}
			newActivities.forEach( ( id ) =>
				callback( id, Object.keys( activities ) )
			);
		},
		[ activities, prevActivities ]
	);

	const onFinished = useCallback(
		( callback ) => {
			const finishedActivities = Object.keys( prevActivities ).filter(
				( id ) => ! activities[ id ]
			);
			if ( ! finishedActivities.length ) {
				return;
			}
			finishedActivities.forEach( ( id ) =>
				callback( id, Object.keys( activities ) )
			);
		},
		[ activities, prevActivities ]
	);

	return {
		activities,
		onStarted,
		onFinished,
	};
};
