import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

import TopNavigation from '../../../ReusableComponents/TopNavigation';
import { useSaveSettings } from '../../../../hooks/useSaveSettings';
import { CommonHooks } from '../../../../data';
import TabBar from '../../../ReusableComponents/TabBar';

// How long the save confirmation stays visible, in milliseconds.
const SAVE_CONFIRMATION_DURATION = 2500;

const SettingsNavigation = ( {
	canSave = true,
	tabs,
	activePanel,
	setActivePanel,
} ) => {
	const { persistAll } = useSaveSettings();

	const title = __( 'PayPal Payments', 'woocommerce-paypal-payments' );

	return (
		<TopNavigation
			title={ title }
			exitOnTitleClick={ true }
			subNavigation={
				<TabBar
					tabs={ tabs }
					activePanel={ activePanel }
					setActivePanel={ setActivePanel }
				/>
			}
		>
			{ canSave && (
				<>
					<Button variant="primary" onClick={ persistAll }>
						{ __( 'Save', 'woocommerce-paypal-payments' ) }
					</Button>
					<SaveStateMessage />
				</>
			) }
		</TopNavigation>
	);
};

export default SettingsNavigation;

const SaveStateMessage = () => {
	const [ isSaving, setIsSaving ] = useState( false );
	const [ showMessage, setShowMessage ] = useState( false );
	const { onStarted, onFinished } = CommonHooks.useActivityObserver();
	const hideTimerRef = useRef( null );

	const handleActivityStart = useCallback(
		( started ) => {
			if ( ! isSaving && started.startsWith( 'persist' ) ) {
				setIsSaving( true );
				setShowMessage( false );
			}
		},
		[ isSaving ]
	);

	const handleActivityDone = useCallback(
		( done, remaining ) => {
			if ( remaining.length === 0 && isSaving ) {
				setIsSaving( false );
				setShowMessage( true );
			}
		},
		[ isSaving ]
	);

	useEffect( () => {
		onStarted( handleActivityStart );
		onFinished( handleActivityDone );

		return () => {
			if ( hideTimerRef.current ) {
				clearTimeout( hideTimerRef.current );
			}
		};
	}, [ onStarted, onFinished, handleActivityStart, handleActivityDone ] );

	useEffect( () => {
		if ( showMessage && ! isSaving ) {
			hideTimerRef.current = setTimeout( () => {
				setShowMessage( false );
			}, SAVE_CONFIRMATION_DURATION );
		}

		return () => {
			if ( hideTimerRef.current ) {
				clearTimeout( hideTimerRef.current );
			}
		};
	}, [ showMessage, isSaving ] );

	if ( ! showMessage ) {
		return null;
	}

	return (
		<span className="ppcp-r-navbar-notice ppcp--success">
			<span className="ppcp--inner-text">
				{ __( 'Completed', 'woocommerce-paypal-payments' ) }
			</span>
		</span>
	);
};
