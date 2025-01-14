import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PREVIEW_CLIENT_ID = 'test';
const PREVIEW_MERCHANT_ID = 'QTQX5NP6N9WZU';

const PaymentButtonPreview = ( {
	style,
	components = [ 'buttons', 'googlepay' ],
} ) => {
	return (
		<PayPalScriptProvider
			options={ {
				clientId: PREVIEW_CLIENT_ID,
				merchantId: PREVIEW_MERCHANT_ID,
				components: components.join( ',' ),
				'disable-funding': 'card',
				'buyer-country': 'US',
				currency: 'USD',
			} }
		>
			<PayPalButtons style={ style } forceReRender={ [ style ] }>
				Error
			</PayPalButtons>
		</PayPalScriptProvider>
	);
};

export default PaymentButtonPreview;
