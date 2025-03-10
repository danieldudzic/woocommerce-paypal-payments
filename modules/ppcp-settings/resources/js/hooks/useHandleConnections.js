import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';

import { CommonHooks, OnboardingHooks } from '../data';
import { useStoreManager } from './useStoreManager';

const PAYPAL_PARTNER_SDK_URL =
	'https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js';

const MESSAGES = {
	CONNECTED: __( 'Connected to PayPal', 'woocommerce-paypal-payments' ),
	API_ERROR: __(
		'Could not connect to PayPal. Please make sure your Client ID and Secret Key are correct.',
		'woocommerce-paypal-payments'
	),
	LOGIN_FAILED: __(
		'Login was not successful. Please try again.',
		'woocommerce-paypal-payments'
	),
};

const ACTIVITIES = {
	OAUTH_VERIFY: 'oauth/login',
	API_LOGIN: 'auth/api-login',
	API_VERIFY: 'auth/verify-login',
};

export const useHandleOnboardingButton = ( isSandbox ) => {
	const { onboardingUrl } = isSandbox
		? CommonHooks.useSandbox()
		: CommonHooks.useProduction();
	const { products, options } = OnboardingHooks.useDetermineProducts();
	const { startActivity } = CommonHooks.useBusyState();
	const { authenticateWithOAuth } = CommonHooks.useAuthentication();
	const [ onboardingUrlState, setOnboardingUrl ] = useState( '' );
	const [ scriptLoaded, setScriptLoaded ] = useState( false );
	const timerRef = useRef( null );

	useEffect( () => {
		const fetchOnboardingUrl = async () => {
			const res = await onboardingUrl( products, options, isSandbox );

			if ( res.success && res.data ) {
				setOnboardingUrl( res.data );
			} else {
				console.error( 'Failed to fetch onboarding URL' );
			}
		};

		fetchOnboardingUrl();
	}, [ isSandbox, products, options, onboardingUrl ] );

	useEffect( () => {
		if ( ! onboardingUrlState ) {
			return;
		}

		const script = document.createElement( 'script' );
		script.id = 'partner-js';
		script.src = PAYPAL_PARTNER_SDK_URL;
		script.onload = () => {
			setScriptLoaded( true );
		};
		document.body.appendChild( script );

		return () => {
			const onboardingScripts = [
				'partner-js',
				'signup-js',
				'rampConfig-js',
			];

			onboardingScripts.forEach( ( id ) => {
				const el = document.querySelector( `script[id="${ id }"]` );

				if ( el?.parentNode ) {
					el.parentNode.removeChild( el );
				}
			} );
		};
	}, [ onboardingUrlState ] );

	const setCompleteHandler = useCallback(
		( environment ) => {
			const onComplete = async ( authCode, sharedId ) => {
				startActivity(
					ACTIVITIES.OAUTH_VERIFY,
					'Validating the connection details'
				);

				await authenticateWithOAuth(
					sharedId,
					authCode,
					environment === 'sandbox'
				);
			};

			const addHandler = () => {
				const MiniBrowser = window.PAYPAL?.apps?.Signup?.MiniBrowser;
				if ( ! MiniBrowser || MiniBrowser.onOnboardComplete ) {
					return;
				}

				MiniBrowser.onOnboardComplete = onComplete;
			};

			timerRef.current = setInterval( addHandler, 250 );
		},
		[ authenticateWithOAuth, startActivity ]
	);

	const removeCompleteHandler = useCallback( () => {
		if ( timerRef.current ) {
			clearInterval( timerRef.current );
			timerRef.current = null;
		}

		delete window.PAYPAL?.apps?.Signup?.MiniBrowser?.onOnboardComplete;
	}, [] );

	return {
		onboardingUrl: onboardingUrlState,
		scriptLoaded,
		setCompleteHandler,
		removeCompleteHandler,
	};
};

// Base connection is only used for API login (manual connection).
const useConnectionBase = () => {
	const { setCompleted } = OnboardingHooks.useSteps();
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );
	const { verifyLoginStatus } = CommonHooks.useMerchantInfo();
	const { withActivity } = CommonHooks.useBusyState();
	const { refreshAll } = useStoreManager();

	return {
		handleFailed: ( res, genericMessage ) => {
			console.error( 'Connection error', res );
			createErrorNotice( res?.message ?? genericMessage );
		},
		handleCompleted: async () => {
			await withActivity(
				ACTIVITIES.API_VERIFY,
				'Verifying Authentication',
				async () => {
					try {
						const loginSuccessful = await verifyLoginStatus();

						if ( loginSuccessful ) {
							createSuccessNotice( MESSAGES.CONNECTED );
							await setCompleted( true );
							refreshAll();
						} else {
							createErrorNotice( MESSAGES.LOGIN_FAILED );
						}
					} catch ( error ) {
						createErrorNotice(
							error.message ?? MESSAGES.LOGIN_FAILED
						);
					}
				}
			);
		},
		createErrorNotice,
	};
};

export const useSandboxConnection = () => {
	const { isSandboxMode, setSandboxMode } = CommonHooks.useSandbox();

	return {
		isSandboxMode,
		setSandboxMode,
	};
};

export const useDirectAuthentication = () => {
	const { handleFailed, handleCompleted, createErrorNotice } =
		useConnectionBase();
	const { withActivity } = CommonHooks.useBusyState();
	const {
		authenticateWithCredentials,
		isManualConnectionMode,
		setManualConnectionMode,
	} = CommonHooks.useAuthentication();

	const handleDirectAuthentication = async ( connectionDetails ) => {
		return withActivity(
			ACTIVITIES.API_LOGIN,
			'Connecting manually via Client ID and Secret',
			async () => {
				let data;

				if ( 'function' === typeof connectionDetails ) {
					try {
						data = connectionDetails();
					} catch ( exception ) {
						createErrorNotice( exception.message );
						return;
					}
				} else if ( 'object' === typeof connectionDetails ) {
					data = connectionDetails;
				}

				if ( ! data || ! data.clientId || ! data.clientSecret ) {
					createErrorNotice(
						'Invalid connection details (clientID or clientSecret missing)'
					);
					return;
				}

				const res = await authenticateWithCredentials(
					data.clientId,
					data.clientSecret,
					!! data.isSandbox
				);

				if ( res.success ) {
					await handleCompleted();
				} else {
					handleFailed( res, MESSAGES.API_ERROR );
				}

				return res.success;
			}
		);
	};

	return {
		handleDirectAuthentication,
		isManualConnectionMode,
		setManualConnectionMode,
	};
};
