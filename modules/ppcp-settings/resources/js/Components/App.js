import { useEffect, useMemo, useState } from '@wordpress/element';
import classNames from 'classnames';

import { OnboardingHooks, CommonHooks } from '../data';
import SpinnerOverlay from './ReusableComponents/SpinnerOverlay';
import SendOnlyMessage from './Screens/SendOnlyMessage';
import OnboardingScreen from './Screens/Onboarding';
import SettingsScreen from './Screens/Settings';
import { getQuery, updateQueryString } from '../utils/navigation';

const SettingsApp = () => {
	const { isReady: onboardingIsReady, completed: onboardingCompleted } =
		OnboardingHooks.useSteps();
	const { isReady: merchantIsReady } = CommonHooks.useStore();
	const {
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
		loading: ! onboardingIsReady,
	} );

	const cleanBrowserUrl = () => {
		const queryArgs = getQuery();
		const supportedArgs = [ 'page', 'tab', 'section' ];

		const cleanedArgs = Object.keys( queryArgs ).reduce( ( acc, key ) => {
			if ( supportedArgs.includes( key ) ) {
				acc[ key ] = queryArgs[ key ];
			}
			return acc;
		}, {} );

		const isUrlClean =
			Object.keys( cleanedArgs ).length ===
			Object.keys( queryArgs ).length;

		if ( isUrlClean ) {
			return;
		}
		updateQueryString( cleanedArgs, true );
		setActivePanel( '' );
	};

	const [ activePanel, setActivePanel ] = useState( getQuery().panel );

	const Content = useMemo( () => {
		if ( ! onboardingIsReady || ! merchantIsReady ) {
			return <SpinnerOverlay asModal={ true } />;
		}

		if ( isSendOnlyCountry ) {
			cleanBrowserUrl( true );
			return <SendOnlyMessage />;
		}

		if ( ! onboardingCompleted ) {
			cleanBrowserUrl( true );
			return <OnboardingScreen />;
		}

		return (
			<SettingsScreen
				activePanel={ activePanel || 'overview' }
				setActivePanel={ setActivePanel }
			/>
		);
	}, [
		isSendOnlyCountry,
		merchantIsReady,
		onboardingCompleted,
		onboardingIsReady,
		activePanel,
	] );

	return <div className={ wrapperClass }>{ Content }</div>;
};

export default SettingsApp;
