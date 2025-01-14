import { __ } from '@wordpress/i18n';

import { CommonHooks, OnboardingHooks } from '../../../../data';
import SelectBoxWrapper from '../../../ReusableComponents/SelectBoxWrapper';
import SelectBox from '../../../ReusableComponents/SelectBox';
import PricingDescription from '../../../ReusableComponents/PricingDescription';
import OnboardingHeader from '../Components/OnboardingHeader';
import OptionalPaymentMethods from '../Components/OptionalPaymentMethods';

const OPM_RADIO_GROUP_NAME = 'optional-payment-methods';

const StepPaymentMethods = ( {} ) => {
	const {
		areOptionalPaymentMethodsEnabled,
		setAreOptionalPaymentMethodsEnabled,
	} = OnboardingHooks.useOptionalPaymentMethods();

	const { storeCountry, storeCurrency } = CommonHooks.useWooSettings();

	let screenTitle = __(
		'Add optional payment methods to your Checkout',
		'woocommerce-paypal-payments'
	);

	if ( 'US' === storeCountry ) {
		screenTitle = __(
			'Add Expanded Checkout for More Ways to Pay',
			'woocommerce-paypal-payments'
		);
	}

	return (
		<div className="ppcp-r-page-optional-payment-methods">
			<OnboardingHeader title={ screenTitle } />
			<div className="ppcp-r-inner-container">
				<SelectBoxWrapper>
					<SelectBox
						title={ __(
							'Available with additional application',
							'woocommerce-paypal-payments'
						) }
						description={
							<OptionalPaymentMethods
								useAcdc={ true }
								isFastlane={ true }
								isPayLater={ true }
								storeCountry={ storeCountry }
								storeCurrency={ storeCurrency }
							/>
						}
						name={ OPM_RADIO_GROUP_NAME }
						value={ true }
						changeCallback={ setAreOptionalPaymentMethodsEnabled }
						currentValue={ areOptionalPaymentMethodsEnabled }
						type="radio"
					></SelectBox>
					<SelectBox
						title={ __(
							'No thanks, I prefer to use a different provider for processing credit cards, digital wallets, and local payment methods',
							'woocommerce-paypal-payments'
						) }
						name={ OPM_RADIO_GROUP_NAME }
						value={ false }
						changeCallback={ setAreOptionalPaymentMethodsEnabled }
						currentValue={ areOptionalPaymentMethodsEnabled }
						type="radio"
					></SelectBox>
				</SelectBoxWrapper>
				<PricingDescription />
			</div>
		</div>
	);
};

export default StepPaymentMethods;
