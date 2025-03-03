<?php
/**
 * Endpoint to get the PayPal order.
 *
 * @package WooCommerce\PayPalCommerce\Button\Endpoint
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Button\Endpoint;

use WooCommerce\PayPalCommerce\ApiClient\Endpoint\OrderEndpoint;
use WooCommerce\PayPalCommerce\Button\Exception\RuntimeException;

/**
 * Class ApproveSubscriptionEndpoint
 */
class GetOrderEndpoint implements EndpointInterface {

	public const ENDPOINT = 'ppc-get-order';

	/**
	 * The request data helper.
	 *
	 * @var RequestData
	 */
	private RequestData $request_data;

	/**
	 * The order endpoint.
	 *
	 * @var OrderEndpoint
	 */
	private OrderEndpoint $order_endpoint;


	/**
	 * Constructor.
	 *
	 * @param RequestData   $request_data   The request data helper.
	 * @param OrderEndpoint $order_endpoint The order endpoint.
	 */
	public function __construct(
		RequestData $request_data,
		OrderEndpoint $order_endpoint
	) {
		$this->request_data   = $request_data;
		$this->order_endpoint = $order_endpoint;
	}

	/**
	 * The nonce.
	 *
	 * @return string
	 */
	public static function nonce() : string {
		return self::ENDPOINT;
	}

	/**
	 * Handles the request responds with the PayPal order details.
	 *
	 * @return bool This method never returns a value, but we must implement the interface.
	 * @throws RuntimeException When order not found or handling failed.
	 */
	public function handle_request() : bool {
		$data = $this->request_data->read_request( self::nonce() );

		if ( ! isset( $data['order_id'] ) ) {
			throw new RuntimeException(
				__( 'No order id given', 'woocommerce-paypal-payments' )
			);
		}

		$order = $this->order_endpoint->raw_order( $data['order_id'] );

		wp_send_json_success( $order );

		return true;
	}
}
