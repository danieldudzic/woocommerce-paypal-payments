import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { CheckboxStylingSection } from '../Layout';

const SectionPaymentMethods = ( { location } ) => {
	const { paymentMethods, setPaymentMethods, paymentMethodChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<CheckboxStylingSection
			title={ __( 'Payment Methods', 'woocommerce-paypal-payments' ) }
			className="payment-methods"
			options={ paymentMethodChoices }
			value={ paymentMethods }
			onChange={ setPaymentMethods }
		/>
	);
};

export default SectionPaymentMethods;
