import { __ } from '@wordpress/i18n';

import BadgeBox from '../../../ReusableComponents/BadgeBox';
import { Separator } from '../../../ReusableComponents/Elements';
import PricingTitleBadge from '../../../ReusableComponents/PricingTitleBadge';
import { CardFields } from './PaymentOptions';

const AcdcOptionalPaymentMethods = ( {
	isFastlane,
	isPayLater,
	storeCountry,
} ) => {
	if ( isFastlane && isPayLater && storeCountry === 'US' ) {
		return (
			<div className="ppcp-r-optional-payment-methods__wrapper">
				<CardFields />
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<BadgeBox
					title={ __(
						'Digital Wallets',
						'woocommerce-paypal-payments'
					) }
					imageBadge={ [
						'icon-button-apple-pay.svg',
						'icon-button-google-pay.svg',
					] }
					textBadge={ <PricingTitleBadge item="dw" /> }
					description={ __(
						'Accept Apple Pay on eligible devices and Google Pay through mobile and web.',
						'woocommerce-paypal-payments'
					) }
					learnMoreLink={
						'https://www.paypal.com/us/business/paypal-business-fees'
					}
				/>
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<BadgeBox
					title={ __(
						'Alternative Payment Methods',
						'woocommerce-paypal-payments'
					) }
					imageBadge={ [
						'icon-button-ideal.svg',
						'icon-button-blik.svg',
						'icon-button-bancontact.svg',
					] }
					textBadge={ <PricingTitleBadge item="apm" /> }
					description={ __(
						'Seamless payments for customers across the globe using their preferred payment methods.',
						'woocommerce-paypal-payments'
					) }
					learnMoreLink={
						'https://www.paypal.com/us/business/paypal-business-fees'
					}
				/>
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<BadgeBox
					title={ __( '', 'woocommerce-paypal-payments' ) }
					imageBadge={ [ 'icon-payment-method-fastlane-small.svg' ] }
					textBadge={
						<PricingTitleBadge item="fast country currency=storeCurrency=storeCountrylane" />
					}
					description={ __(
						"Speed up guest checkout with Fatslane. Link a customer's email address to their payment details.",
						'woocommerce-paypal-payments'
					) }
					learnMoreLink={
						'https://www.paypal.com/us/business/paypal-business-fees'
					}
				/>
			</div>
		);
	}

	if ( isPayLater && storeCountry === 'uk' ) {
		return (
			<div className="ppcp-r-optional-payment-methods__wrapper">
				<CardFields />
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<BadgeBox
					title={ __(
						'Digital Wallets',
						'woocommerce-paypal-payments'
					) }
					imageBadge={ [
						'icon-button-apple-pay.svg',
						'icon-button-google-pay.svg',
					] }
					textBadge={ <PricingTitleBadge item="dw" /> }
					description={ __(
						'Accept Apple Pay on eligible devices and Google Pay through mobile and web.',
						'woocommerce-paypal-payments'
					) }
					learnMoreLink={
						'https://www.paypal.com/us/business/paypal-business-fees'
					}
				/>
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<BadgeBox
					title={ __(
						'Alternative Payment Methods',
						'woocommerce-paypal-payments'
					) }
					imageBadge={ [
						// 'icon-button-sepa.svg',
						'icon-button-ideal.svg',
						'icon-button-blik.svg',
						'icon-button-bancontact.svg',
					] }
					textBadge={ <PricingTitleBadge item="apm" /> }
					description={ __(
						'Seamless payments for customers across the globe using their preferred payment methods.',
						'woocommerce-paypal-payments'
					) }
					learnMoreLink={
						'https://www.paypal.com/us/business/paypal-business-fees'
					}
				/>
			</div>
		);
	}

	return (
		<div className="ppcp-r-optional-payment-methods__wrapper">
			<CardFields />
			<Separator className="ppcp-r-optional-payment-methods__separator" />
			<BadgeBox
				title={ __( 'Digital Wallets', 'woocommerce-paypal-payments' ) }
				imageBadge={ [
					'icon-button-apple-pay.svg',
					'icon-button-google-pay.svg',
				] }
				textBadge={ <PricingTitleBadge item="dw" /> }
				description={ __(
					'Accept Apple Pay on eligible devices and Google Pay through mobile and web.',
					'woocommerce-paypal-payments'
				) }
				learnMoreLink={
					'https://www.paypal.com/us/business/paypal-business-fees'
				}
			/>
			<Separator className="ppcp-r-optional-payment-methods__separator" />
			<BadgeBox
				title={ __(
					'Alternative Payment Methods',
					'woocommerce-paypal-payments'
				) }
				imageBadge={ [
					// 'icon-button-sepa.svg',
					'icon-button-ideal.svg',
					'icon-button-blik.svg',
					'icon-button-bancontact.svg',
				] }
				textBadge={ <PricingTitleBadge item="apm" /> }
				description={ __(
					'Seamless payments for customers across the globe using their preferred payment methods.',
					'woocommerce-paypal-payments'
				) }
				learnMoreLink={
					'https://www.paypal.com/us/business/paypal-business-fees'
				}
			/>
		</div>
	);
};

export default AcdcOptionalPaymentMethods;
