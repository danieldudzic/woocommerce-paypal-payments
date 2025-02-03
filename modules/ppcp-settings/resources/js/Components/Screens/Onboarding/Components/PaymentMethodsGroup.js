import { Separator } from '../../../ReusableComponents/Elements';

const PaymentMethodsGroup = ( { methods } ) => {
	return (
		<>
			{ methods.map( ( method, index ) => (
				<PaymentMethodItem
					key={ method.name }
					{ ...method }
					showSeparator={ index < methods.length - 1 }
				/>
			) ) }
		</>
	);
};

export default PaymentMethodsGroup;

const PaymentMethodItem = ( { Component, showSeparator } ) => {
	return (
		<>
			<Component />
			{ showSeparator && (
				<Separator className="ppcp-r-page-welcome-mode-separator" />
			) }
		</>
	);
};
