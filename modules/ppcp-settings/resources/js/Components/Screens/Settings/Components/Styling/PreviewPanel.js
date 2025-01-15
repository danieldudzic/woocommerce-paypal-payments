import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PREVIEW_CLIENT_ID = 'test';
const PREVIEW_MERCHANT_ID = 'QTQX5NP6N9WZU';

const PreviewPanel = () => {
	// TODO: Make those props dynamic based on location style settings.
	const style = {};
	const components = [ 'buttons', 'googlepay' ];

	const providerOptions = {
		clientId: PREVIEW_CLIENT_ID,
		merchantId: PREVIEW_MERCHANT_ID,
		components: components.join( ',' ),
		'disable-funding': 'card',
		'buyer-country': 'US',
		currency: 'USD',
	};

	return (
		<div className="preview-panel">
			<div className="preview-panel-inner">
				<PayPalScriptProvider options={ providerOptions }>
					<PayPalButtons style={ style } forceReRender={ [ style ] }>
						Error
					</PayPalButtons>
				</PayPalScriptProvider>
			</div>
		</div>
	);
};

export default PreviewPanel;
