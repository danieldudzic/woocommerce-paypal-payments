import React, { useEffect } from 'react';
import { PayLaterMessagingHooks } from '../../../data';

const TabPayLaterMessaging = () => {
	const { config } = PayLaterMessagingHooks.usePayLaterMessaging();
	const PcpPayLaterConfigurator =
		window.ppcpSettings?.PcpPayLaterConfigurator;

	useEffect( () => {
		if ( window.merchantConfigurators && PcpPayLaterConfigurator ) {
			window.merchantConfigurators.Messaging( {
				config,
				merchantClientId: PcpPayLaterConfigurator.merchantClientId,
				partnerClientId: PcpPayLaterConfigurator.partnerClientId,
				partnerName: 'WooCommerce',
				bnCode: PcpPayLaterConfigurator.bnCode,
				placements: [
					'cart',
					'checkout',
					'product',
					'shop',
					'home',
					'custom_placement',
				],
				styleOverrides: {
					button: 'ppcp-r-paylater-configurator__publish-button',
					header: 'ppcp-r-paylater-configurator__header',
					subheader: 'ppcp-r-paylater-configurator__subheader',
				},
				onSave: ( data ) => {
					/*
                    TODO:
                    - The saving will be handled in a separate PR.
                    - One option could be:
                      - When saving the settings, programmatically click on the configurator's
                        "Save Changes" button and send the request to PHP.
                    */
				},
			} );
		}
	}, [ PcpPayLaterConfigurator, config ] );

	return (
		<div
			id="messaging-configurator"
			className="ppcp-r-paylater-configurator"
		></div>
	);
};

export default TabPayLaterMessaging;
