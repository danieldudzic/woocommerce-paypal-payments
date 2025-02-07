import { __ } from '@wordpress/i18n';

import { PaymentHooks, StylingHooks } from '../../../../../../data';
import { CheckboxStylingSection } from '../Layout';

const SectionPaymentMethods = ( { location } ) => {
	const { paymentMethods, setPaymentMethods, choices } =
		StylingHooks.usePaymentMethodProps( location );

	const methods = PaymentHooks.usePaymentMethods();
	const methodIds = [];
	methods.all.forEach( ( method ) => {
		if ( method.enabled === true ) {
			methodIds.push( method.id );
		}
	} );

	const filteredChoices = choices.filter( ( choice ) => {
		return methodIds.includes( choice.paymentMethod );
	} );

	return (
		<CheckboxStylingSection
			name="payment-methods"
			title={ __( 'Payment Methods', 'woocommerce-paypal-payments' ) }
			options={ filteredChoices }
			value={ paymentMethods }
			onChange={ setPaymentMethods }
		/>
	);
};

export default SectionPaymentMethods;
