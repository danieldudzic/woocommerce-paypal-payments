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
	const refHideTimer = useRef( null );

	const handleActivityStart = useCallback(
		( started ) => {
			if ( isSaving || ! started.match( /^persist/ ) ) {
			return;
		}
		setIsSaving( true );
			setShowMessage( false );
		},
		[ isSaving ]
	);

	const handleActivityDone = useCallback(
		( done, remaining ) => {
			if ( remaining.length || ! isSaving ) {
				return;
			}
			setIsSaving( false );
			setShowMessage( true );
		},
		[ isSaving ]
	);

	useEffect( () => {
		onStarted( handleActivityStart );
	}, [ onStarted, handleActivityStart ] );

	useEffect( () => {
		onFinished( handleActivityDone );
	}, [ onFinished, handleActivityDone ] );

	useEffect( () => {
		// Clear the timer, every time the "showMessage" flag changes.
		if ( refHideTimer.current ) {
			clearTimeout( refHideTimer.current );
			refHideTimer.current = null;
		}
		if ( ! showMessage || isSaving ) {
			return;
		}

		// Restart the hide-timer, when the message is visible.
		refHideTimer.current = setTimeout( () => {
			setShowMessage( false );
		}, SAVE_CONFIRMATION_DURATION );
	}, [ showMessage, isSaving ] );

	if ( ! showMessage ) {
		return null;
	}

	return (
		<span className="ppcp-r-navbar-notice ppcp--success">
			{ __( 'Completed', 'woocommerce-paypal-payments' ) }
		</span>
	);
};
