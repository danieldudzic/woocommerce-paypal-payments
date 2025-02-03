import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../ReusableComponents/BadgeBox';
import PaymentMethodsGroup from './PaymentMethodsGroup';
import { PayPalCheckout } from './PaymentOptions';
import { usePaymentConfig } from '../hooks/usePaymentConfig';

const PaymentFlow = ( { useAcdc, isFastlane, isPayLater, storeCountry } ) => {
	const config = usePaymentConfig(
		storeCountry,
		isPayLater,
		useAcdc,
		isFastlane
	);

	return (
		<div className="ppcp-r-welcome-docs__wrapper">
			<div className="ppcp-r-welcome-docs__col">
				<PayPalCheckout />
				<BadgeBox
					title={ __(
						'Included in PayPal Checkout',
						'woocommerce-paypal-payments'
					) }
				/>
				<PaymentMethodsGroup methods={ config.includedMethods } />
			</div>

			<OptionalMethodsSection
				title={ config.optionalTitle }
				description={ config.optionalDescription }
				methods={ config.optionalMethods }
			/>
		</div>
	);
};

export default PaymentFlow;

const OptionalMethodsSection = ( { title, description, methods } ) => {
	if ( ! methods.length ) {
		return null;
	}

	return (
		<div className="ppcp-r-welcome-docs__col">
			<BadgeBox title={ title } description={ description } />
			<PaymentMethodsGroup methods={ methods } />
		</div>
	);
};
