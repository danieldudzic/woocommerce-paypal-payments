import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../ReusableComponents/BadgeBox';
import { Separator } from '../../../ReusableComponents/Elements';
import PricingTitleBadge from '../../../ReusableComponents/PricingTitleBadge';
import OptionalPaymentMethods from './OptionalPaymentMethods';

const BcdcFlow = ( { isPayLater, storeCountry } ) => {
	if ( isPayLater && storeCountry === 'US' ) {
		return (
			<div className="ppcp-r-welcome-docs__wrapper">
				<div className="ppcp-r-welcome-docs__col">
					<BadgeBox
						title={ __(
							'PayPal Checkout',
							'woocommerce-paypal-payments'
						) }
						textBadge={ <PricingTitleBadge item="checkout" /> }
						description={ __(
							'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximise conversion',
							'woocommerce-paypal-payments'
						) }
					/>
					<BadgeBox
						title={ __(
							'Included in PayPal Checkout',
							'woocommerce-paypal-payments'
						) }
					/>
					<BadgeBox
						title={ __(
							'Pay with PayPal',
							'woocommerce-paypal-payments'
						) }
						imageBadge={ [ 'icon-button-paypal.svg' ] }
						description={ __(
							'Our brand recognition helps give customers the confidence to buy.',
							'woocommerce-paypal-payments'
						) }
						learnMoreLink={
							'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
						}
					/>
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<BadgeBox
						title={ __(
							'Pay Later',
							'woocommerce-paypal-payments'
						) }
						imageBadge={ [
							'icon-payment-method-paypal-small.svg',
						] }
						description={ __(
							'Offer installment payment options and get paid upfront.',
							'woocommerce-paypal-payments'
						) }
						learnMoreLink={
							'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
						}
					/>
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<BadgeBox
						title={ __( 'Venmo', 'woocommerce-paypal-payments' ) }
						imageBadge={ [ 'icon-button-venmo.svg' ] }
						description={ __(
							'Automatically offer Venmo checkout to millions of active users.',
							'woocommerce-paypal-payments'
						) }
						learnMoreLink={
							'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
						}
					/>
					<Separator className="ppcp-r-page-welcome-mode-separator" />
					<BadgeBox
						title={ __( 'Crypto', 'woocommerce-paypal-payments' ) }
						imageBadge={ [ 'icon-payment-method-crypto.svg' ] }
						description={ __(
							'Let customers checkout with Crypto while you get paid in cash.',
							'woocommerce-paypal-payments'
						) }
						learnMoreLink={
							'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
						}
					/>
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
						useAcdc={ false }
						isFastlane={ false }
						isPayLater={ isPayLater }
						storeCountry={ storeCountry }
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="ppcp-r-welcome-docs__wrapper ppcp-r-welcome-docs__wrapper--one-col">
			<BadgeBox
				title={ __( 'PayPal Checkout', 'woocommerce-paypal-payments' ) }
				textBadge={ <PricingTitleBadge item="checkout" /> }
				description={ __(
					'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximise conversion',
					'woocommerce-paypal-payments'
				) }
			/>
			<BadgeBox
				title={ __(
					'Included in PayPal Checkout',
					'woocommerce-paypal-payments'
				) }
			/>
			<BadgeBox
				title={ __( 'Pay with PayPal', 'woocommerce-paypal-payments' ) }
				imageBadge={ [ 'icon-button-paypal.svg' ] }
				description={ __(
					'Our brand recognition helps give customers the confidence to buy.',
					'woocommerce-paypal-payments'
				) }
				learnMoreLink={
					'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
				}
			/>
			<Separator className="ppcp-r-page-welcome-mode-separator" />
			<BadgeBox
				title={ __( 'Pay Later', 'woocommerce-paypal-payments' ) }
				imageBadge={ [ 'icon-payment-method-paypal-small.svg' ] }
				description={ __(
					'Offer installment payment options and get paid upfront.',
					'woocommerce-paypal-payments'
				) }
				learnMoreLink={
					'https://woocommerce.com/document/woocommerce-paypal-payments/#manual-credential-input'
				}
			/>
			<Separator className="ppcp-r-page-welcome-mode-separator" />
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
				useAcdc={ false }
				isFastlane={ false }
				isPayLater={ isPayLater }
				storeCountry={ storeCountry }
			/>
		</div>
	);
};

export default BcdcFlow;
