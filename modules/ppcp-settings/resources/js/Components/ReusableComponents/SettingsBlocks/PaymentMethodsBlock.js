import SettingsBlock from '../SettingsBlock';
import PaymentMethodItemBlock from './PaymentMethodItemBlock';
import { PaymentHooks } from '../../../data';

// TODO: This is not a reusable component, as it's connected to the Redux store.
const PaymentMethodsBlock = ( { paymentMethods = [], onTriggerModal } ) => {
	const { changePaymentSettings } = PaymentHooks.useStore();

	const handleSelect = ( methodId, isSelected ) =>
		changePaymentSettings( methodId, {
			enabled: isSelected,
		} );

	if ( ! paymentMethods.length ) {
		return null;
	}

	return (
		<SettingsBlock className="ppcp--grid ppcp-r-settings-block__payment-methods">
			{ paymentMethods
				// Remove empty/invalid payment method entries.
				.filter( ( m ) => m && m.id )
				.map( ( paymentMethod ) => (
					<PaymentMethodItemBlock
						key={ paymentMethod.id }
						paymentMethod={ paymentMethod }
						isSelected={ paymentMethod.enabled }
						isDisabled={ paymentMethod.isDisabled }
						disabledMessage={ paymentMethod.disabledMessage }
						onSelect={ ( checked ) =>
							handleSelect( paymentMethod.id, checked )
						}
						onTriggerModal={ () =>
							onTriggerModal?.( paymentMethod.id )
						}
						warningMessage={
							'<strong>Note:</strong> The accelerated guest buyer experience provided by Fastlane may not be fully compatible with some of the following <a href="%1$s">active plugins</a>: <ul class="ppcp--method-notice-list"><li>WooCommerce Subscriptions 5.2.0</li><li>Product Add-Ons Premium 6.1.3</li><li>YITH WooCommerce Checkout Manager 3.4.0</li></ul>'
						}
					/>
				) ) }
		</SettingsBlock>
	);
};

export default PaymentMethodsBlock;
