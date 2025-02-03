import { Separator } from '../../../ReusableComponents/Elements';
import {
	AlternativePaymentMethods,
	CardFields,
	DigitalWallets,
	Fastlane,
} from './PaymentOptions';

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
				<DigitalWallets />
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<AlternativePaymentMethods />
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<Fastlane />
			</div>
		);
	}

	if ( isPayLater && storeCountry === 'uk' ) {
		return (
			<div className="ppcp-r-optional-payment-methods__wrapper">
				<CardFields />
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<DigitalWallets />
				<Separator className="ppcp-r-optional-payment-methods__separator" />
				<AlternativePaymentMethods />
			</div>
		);
	}

	return (
		<div className="ppcp-r-optional-payment-methods__wrapper">
			<CardFields />
			<Separator className="ppcp-r-optional-payment-methods__separator" />
			<DigitalWallets />
			<Separator className="ppcp-r-optional-payment-methods__separator" />
			<AlternativePaymentMethods />
		</div>
	);
};

export default AcdcOptionalPaymentMethods;
