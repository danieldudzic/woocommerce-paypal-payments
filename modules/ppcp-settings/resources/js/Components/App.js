import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { OnboardingHooks, CommonHooks, SettingsHooks } from '../data';
import SpinnerOverlay from './ReusableComponents/SpinnerOverlay';
import SendOnlyMessage from './Screens/SendOnlyMessage';
import OnboardingScreen from './Screens/Onboarding';
import SettingsScreen from './Screens/Settings';

const SettingsApp = () => {
	const onboardingProgress = OnboardingHooks.useSteps();
	const {
		isReady: merchantIsReady,
		merchant: { isSendOnlyCountry },
	} = CommonHooks.useMerchantInfo();

	// Disable the "Changes you made might not be saved" browser warning.
	useEffect( () => {
		const suppressBeforeUnload = ( event ) => {
			event.stopImmediatePropagation();
			return undefined;
		};
		window.addEventListener( 'beforeunload', suppressBeforeUnload );
		return () => {
			window.removeEventListener( 'beforeunload', suppressBeforeUnload );
		};
	}, [] );

	const wrapperClass = classNames( 'ppcp-r-app', {
		loading: ! onboardingProgress.isReady || ! settingsIsReady,
	} );

	const Content = useMemo( () => {
		if ( ! onboardingProgress.isReady || ! merchantIsReady ) {
			return <SpinnerOverlay />;
		}
		if ( isSendOnlyCountry ) {
			return <SendOnlyMessage />;
		}
		if ( ! onboardingProgress.completed ) {
			return <OnboardingScreen />;
		}
		return <SettingsScreen />;
	}, [
		isSendOnlyCountry,
		merchantIsReady,
		onboardingProgress.completed,
		onboardingProgress.isReady,
	] );

	return <div className={ wrapperClass }>{ Content }</div>;
};

export default SettingsApp;
