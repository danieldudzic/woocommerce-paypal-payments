import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../ReusableComponents/BadgeBox';
import { Separator } from '../../../ReusableComponents/Elements';
import OptionalPaymentMethods from './OptionalPaymentMethods';
import {
	PayLater,
	PayPalCheckout,
	Crypto,
	PayWithPayPal,
	Venmo,
	PayInThree,
} from './PaymentOptions';

const AcdcFlow = ( { isFastlane, isPayLater, storeCountry } ) => {
	if ( isFastlane && isPayLater && storeCountry === 'US' ) {
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
					<PayWithPayPal />
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<PayLater />
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<Venmo />
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<Crypto />
				</div>
				<div className="ppcp-r-welcome-docs__col">
					<BadgeBox
						title={ __(
							'Expanded Checkout',
							'woocommerce-paypal-payments'
						) }
						description={ __(
							'Accept debit/credit cards, PayPal, Apple Pay, Google Pay, and more. Note: Additional application required for more methods',
							'woocommerce-paypal-payments'
						) }
					/>
					<OptionalPaymentMethods
						useAcdc={ true }
						isFastlane={ isFastlane }
						isPayLater={ isPayLater }
						storeCountry={ storeCountry }
					/>
				</div>
			</div>
		);
	}

	if ( isPayLater && storeCountry === 'UK' ) {
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
					<PayWithPayPal />
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<PayInThree />
				</div>
				<div className="ppcp-r-welcome-docs__col">
					<BadgeBox
						title={ __(
							'Optional payment methods',
							'woocommerce-paypal-payments'
						) }
						description={ __(
							'with additional application',
							'woocommerce-paypal-payments'
						) }
					/>
					<OptionalPaymentMethods
						useAcdc={ true }
						isFastlane={ isFastlane }
						isPayLater={ isPayLater }
						storeCountry={ storeCountry }
					/>
				</div>
			</div>
		);
	}

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
				<PayWithPayPal />
				<Separator className="ppcp-r-page-welcome-mode-separator" />
				<PayLater />
			</div>
			<div className="ppcp-r-welcome-docs__col">
				<BadgeBox
					title={ __(
						'Optional payment methods',
						'woocommerce-paypal-payments'
					) }
					description={ __(
						'with additional application',
						'woocommerce-paypal-payments'
					) }
				/>
				<OptionalPaymentMethods
					useAcdc={ true }
					isFastlane={ isFastlane }
					isPayLater={ isPayLater }
					storeCountry={ storeCountry }
				/>
			</div>
		</div>
	);
};

export default AcdcFlow;
