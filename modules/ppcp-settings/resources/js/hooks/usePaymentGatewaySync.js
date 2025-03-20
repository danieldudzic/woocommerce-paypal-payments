import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { OnboardingHooks, CommonHooks } from '../data';
import { STORE_NAME as ONBOARDING_STORE_NAME } from '../data/onboarding';
/**
 * Custom hook for handling gateway synchronization
 *
 * @return {boolean} Whether gateway sync is completed
 */
export const usePaymentGatewaySync = () => {
	// Get sync state from Redux
	const { gatewaysSynced } = OnboardingHooks.useGatewaySync();
	const { syncGateways } = useDispatch( ONBOARDING_STORE_NAME );
	// Get required state
	const { isReady: onboardingIsReady, completed: onboardingCompleted } =
		OnboardingHooks.useSteps();
	const { isReady: merchantIsReady } = CommonHooks.useStore();
	// Define sync state hooks
	const [ isSyncing, setIsSyncing ] = useState( false );
	const [ syncCompleted, setSyncCompleted ] = useState( false );
	const [ syncError, setSyncError ] = useState( null );
	// Use a ref to track if we've initiated a sync during this session
	const syncAttemptedRef = useRef( false );

	/**
	 * Handles the gateway synchronization
	 *
	 * @return {Promise<Object>} Result of the sync operation
	 */
	const handleSync = useCallback( async () => {
		if ( isSyncing ) {
			return { success: false, skipped: true };
		}
		setIsSyncing( true );
		setSyncError( null );
		try {
			await apiFetch( {
				path: '/wc/v3/wc_paypal/onboarding/sync-gateways',
				method: 'POST',
			} );
			const result = await syncGateways();
			if ( result.success ) {
				await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
				setSyncCompleted( true );
				return { success: true };
			}
			throw new Error( result.message || 'Failed to sync gateways' );
		} catch ( error ) {
			setSyncError( error );
			// After an error, allow retry after 5 seconds.
			setTimeout( () => {
				syncAttemptedRef.current = false;
			}, 5000 );
			return { success: false, error };
		} finally {
			setIsSyncing( false );
		}
	}, [ isSyncing, syncGateways ] );

	// Automatically sync when conditions are met.
	useEffect( () => {
		// Skip if required conditions aren't met.
		if ( ! onboardingIsReady || ! merchantIsReady || gatewaysSynced ) {
			return;
		}
		// Only attempt sync if not already syncing and no previous attempt.
		if ( ! isSyncing && ! syncAttemptedRef.current ) {
			syncAttemptedRef.current = true;
			handleSync();
		}
	}, [
		onboardingIsReady,
		merchantIsReady,
		onboardingCompleted,
		gatewaysSynced,
		isSyncing,
		handleSync,
	] );

	return gatewaysSynced;
};

export default usePaymentGatewaySync;
