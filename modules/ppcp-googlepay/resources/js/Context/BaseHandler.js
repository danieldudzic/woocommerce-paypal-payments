import ErrorHandler from '../../../../ppcp-button/resources/js/modules/ErrorHandler';
import CartActionHandler from '../../../../ppcp-button/resources/js/modules/ActionHandler/CartActionHandler';
import TransactionInfo from '../Helper/TransactionInfo';

class BaseHandler {
	constructor( buttonConfig, ppcpConfig, externalHandler ) {
		this.buttonConfig = buttonConfig;
		this.ppcpConfig = ppcpConfig;
		this.externalHandler = externalHandler;
	}

	validateContext() {
		if ( this.ppcpConfig?.locations_with_subscription_product?.cart ) {
			return false;
		}
		return true;
	}

	shippingAllowed() {
		// Status of the shipping settings in WooCommerce.
		return this.buttonConfig.shipping.configured;
	}

	transactionInfo() {
		return new Promise( ( resolve, reject ) => {
			fetch( this.ppcpConfig.ajax.cart_script_params.endpoint, {
				method: 'GET',
				credentials: 'same-origin',
			} )
				.then( ( result ) => result.json() )
				.then( ( result ) => {
					if ( ! result.success ) {
						return;
					}

					// handle script reload
					const data = result.data;
					const transaction = new TransactionInfo(
						data.total,
						data.shipping_fee,
						data.currency_code,
						data.country_code
					);

					resolve( transaction );
				} );
		} );
	}

	createOrder() {
		return this.actionHandler().configuration().createOrder( null, null );
	}

	approveOrder( data, actions ) {
		return this.actionHandler().configuration().onApprove( data, actions );
	}

	captureOrder( data, actions ) {
		return fetch( this.ppcpConfig.ajax.get_order.endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'same-origin',
			body: JSON.stringify( {
				nonce: this.ppcpConfig.ajax.get_order.nonce,
				order_id: data.orderID,
			} ),
		} )
			.then( ( order ) => {
				console.log( 'order', order );
				const orderResponse = order.json();
				console.log(
					orderResponse?.payment_source?.google_pay?.card
						?.authentication_result
				);

				return fetch( this.ppcpConfig.ajax.capture_order.endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'same-origin',
					body: JSON.stringify( {
						nonce: this.ppcpConfig.ajax.capture_order.nonce,
						order_id: data.orderID,
					} ),
				} );
			} )
			.then( ( response ) => response.json() )
			.then( ( captureResponse ) => {
				console.log( 'Capture response:', captureResponse );
				const orderReceivedUrl =
					captureResponse.data?.order_received_url;
				console.log( 'orderReceivedUrl', orderReceivedUrl );
				setTimeout( () => {
					window.location.href = orderReceivedUrl;
				}, 200 );
			} )
			.catch( ( error ) => {
				console.error( 'Error:', error );
			} );
	}

	actionHandler() {
		return new CartActionHandler( this.ppcpConfig, this.errorHandler() );
	}

	errorHandler() {
		return new ErrorHandler(
			this.ppcpConfig.labels.error.generic,
			document.querySelector( '.woocommerce-notices-wrapper' )
		);
	}
}

export default BaseHandler;
