import { CreditDebitCards } from './PaymentOptions';

const BcdcOptionalPaymentMethods = ( { isPayLater, storeCountry } ) => {
	if ( isPayLater && storeCountry === 'us' ) {
		return (
			<div className="ppcp-r-optional-payment-methods__wrapper">
				<CreditDebitCards />
			</div>
		);
	}

	return (
		<div className="ppcp-r-optional-payment-methods__wrapper">
			<CreditDebitCards />
		</div>
	);
};

export default BcdcOptionalPaymentMethods;
