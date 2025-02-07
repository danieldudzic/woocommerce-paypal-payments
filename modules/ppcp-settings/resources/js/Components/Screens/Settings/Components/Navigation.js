import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from '@wordpress/element';

import TopNavigation from '../../../ReusableComponents/TopNavigation';
import { useSaveSettings } from '../../../../hooks/useSaveSettings';
import { CommonHooks } from '../../../../data';
import TabBar from '../../../ReusableComponents/TabBar';

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

	const handleActivityStart = useCallback( ( started ) => {
		if ( ! started.match( /^persist/ ) ) {
			return;
		}
		setIsSaving( true );
	}, [] );

	const handleActivityDone = useCallback(
		( done, remaining ) => {
			if ( remaining.length || ! isSaving ) {
				return;
			}

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

	if ( ! showMessage ) {
		return null;
	}

	return (
		<span className="ppcp-r-navbar-notice ppcp--success">
			{ __( 'Completed', 'woocommerce-paypal-payments' ) }
		</span>
	);
};
