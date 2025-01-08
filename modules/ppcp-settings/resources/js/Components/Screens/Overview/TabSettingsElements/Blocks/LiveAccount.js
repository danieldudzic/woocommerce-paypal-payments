import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import {
	AccordionSettingsBlock,
	ButtonSettingsBlock,
	RadioSettingsBlock,
	ToggleSettingsBlock,
	InputSettingsBlock,
} from '../../../../ReusableComponents/SettingsBlocks';
import TitleBadge, {
	TITLE_BADGE_POSITIVE,
} from '../../../../ReusableComponents/TitleBadge';
import ConnectionInfo, {
	connectionStatusDataDefault,
} from '../../../../ReusableComponents/ConnectionInfo';

const LiveAccount = ( { settings, updateFormValue } ) => {
	const className = settings.sandboxConnected
		? 'ppcp-r-settings-block--sandbox-connected'
		: 'ppcp-r-settings-block--sandbox-disconnected';

	return (
		<AccordionSettingsBlock
			title={ __( 'Live Payments', 'woocommerce-paypal-payments' ) }
			className={ className }
			description={
				settings.sandboxConnected
					? __(
							'Your site is currently configured in Sandbox mode to test payments. When you are ready, launch your site and receive live payments via PayPal.',
							'woocommerce-paypal-payments'
					  )
					: __(
							'Your site is currently configured to receive live payments via PayPal.',
							'woocommerce-paypal-payments'
					  )
			}
			actionProps={ {
				callback: updateFormValue,
				key: 'payNowExperience',
				value: settings.payNowExperience,
			} }
		>
			{ ! settings.sandboxConnected && (
				<ButtonSettingsBlock
					title={ __(
						'Live account credentials',
						'woocommerce-paypal-payments'
					) }
					description={ __(
						'Your account is live. To connect the sandbox account, turn off live mode and connect your sandbox account.',
						'woocommerce-paypal-payments'
					) }
					tag={
						<TitleBadge
							type={ TITLE_BADGE_POSITIVE }
							text={ __(
								'Connected',
								'woocommerce-paypal-payments'
							) }
						/>
					}
				>
					<div className="ppcp-r-settings-block--sandbox">
						<ToggleSettingsBlock
							title={ __(
								'Enable Production mode',
								'woocommerce-paypal-payments'
							) }
							actionProps={ {
								callback: updateFormValue,
								key: 'liveAccountEnabled',
								value: settings.liveAccountEnabled,
							} }
						/>
						<ConnectionInfo
							connectionStatusDataDefault={
								connectionStatusDataDefault
							}
						/>
						<Button
							variant="secondary"
							onClick={ () =>
								updateFormValue( 'liveAccountConnected', false )
							}
						>
							{ __(
								'Disconnect Live Account',
								'woocommerce-paypal-payments'
							) }
						</Button>
					</div>
				</ButtonSettingsBlock>
			) }
			{ settings.sandboxConnected && (
				<RadioSettingsBlock
					title={ __(
						'Connect Live Account',
						'woocommerce-paypal-payments'
					) }
					description={ __(
						'Connect a live PayPal account to launch your site and receive live payments via PayPal. PayPal will guide you through the setup process.',
						'woocommerce-paypal-payments'
					) }
					options={ [
						{
							id: 'production_mode',
							value: 'production_mode',
							label: __(
								'Production Mode',
								'woocommerce-paypal-payments'
							),
							description: __(
								'Activate Production mode to connect your live account and receive live payments via PayPal. Stay connected in Sandbox mode to continue testing payments before going live.',
								'woocommerce-paypal-payments'
							),
							additionalContent: (
								<Button
									variant="primary"
									onClick={ () =>
										global.ppcpSettings.startOnboarding()
									}
								>
									{ __(
										'Set up and connect live PayPal Account',
										'woocommerce-paypal-payments'
									) }
								</Button>
							),
						},
						{
							id: 'manual_connect',
							value: 'manual_connect',
							label: __(
								'Manual Connect',
								'woocommerce-paypal-payments'
							),
							description: sprintf(
								__(
									'For advanced users: Connect a custom PayPal REST app for full control over your integration. For more information on creating a PayPal REST application, <a target="_blank" href="%s">click here</a>.',
									'woocommerce-paypal-payments'
								),
								'#'
							),
							additionalContent: (
								<>
									<InputSettingsBlock
										title={ __(
											'Live Account Client ID',
											'woocommerce-paypal-payments'
										) }
										actionProps={ {
											value: settings.liveAccountClientId, // Add this to settings if not present
											callback: updateFormValue,
											key: 'liveAccountClientId',
											placeholder: __(
												'Enter Client ID',
												'woocommerce-paypal-payments'
											),
										} }
									/>
									<InputSettingsBlock
										title={ __(
											'Live Account Secret Key',
											'woocommerce-paypal-payments'
										) }
										actionProps={ {
											value: settings.liveAccountSecretKey, // Add this to settings if not present
											callback: updateFormValue,
											key: 'liveAccountSecretKey',
											placeholder: __(
												'Enter Secret Key',
												'woocommerce-paypal-payments'
											),
										} }
									/>
									<Button
										variant="primary"
										onClick={ () =>
											updateFormValue(
												'liveAccountManuallyConnected',
												true
											)
										} // Add this handler if needed
									>
										{ __(
											'Connect Account',
											'woocommerce-paypal-payments'
										) }
									</Button>
								</>
							),
						},
					] }
					actionProps={ {
						name: 'paypal_connect_sandbox',
						key: 'liveAccountMode',
						currentValue: settings.liveAccountMode,
						callback: updateFormValue,
					} }
				/>
			) }
		</AccordionSettingsBlock>
	);
};

export default LiveAccount;
