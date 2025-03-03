<?php
/**
 * Endpoint to get the PayPal order.
 *
 * @package WooCommerce\PayPalCommerce\Button\Endpoint
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Button\Endpoint;

use WooCommerce\PayPalCommerce\ApiClient\Endpoint\OrderEndpoint;
use WooCommerce\PayPalCommerce\Button\Exception\RuntimeException;
use WooCommerce\PayPalCommerce\Button\Helper\ContextTrait;

/**
 * Class ApproveSubscriptionEndpoint
 */
class GetOrderEndpoint implements EndpointInterface {

	use ContextTrait;

	const ENDPOINT = 'ppc-get-order';

	/**
	 * The request data helper.
	 *
	 * @var RequestData
	 */
	private $request_data;

	/**
	 * The order endpoint.
	 *
	 * @var OrderEndpoint
	 */
	private $order_endpoint;


	/**
	 * ApproveSubscriptionEndpoint constructor.
	 *
	 * @param RequestData             $request_data The request data helper.
	 * @param OrderEndpoint           $order_endpoint The order endpoint.
	 */
	public function __construct(
		RequestData $request_data,
		OrderEndpoint $order_endpoint
	) {
		$this->request_data         = $request_data;
		$this->order_endpoint       = $order_endpoint;
	}

	/**
	 * The nonce.
	 *
	 * @return string
	 */
	public static function nonce(): string {
		return self::ENDPOINT;
	}

	/**
	 * Handles the request.
	 *
	 * @return bool
	 * @throws RuntimeException When order not found or handling failed.
	 */
	public function handle_request(): bool {
		$data = $this->request_data->read_request( $this->nonce() );
		if ( ! isset( $data['order_id'] ) ) {
			throw new RuntimeException(
				__( 'No order id given', 'woocommerce-paypal-payments' )
			);
		}

		$order = $this->order_endpoint->order( $data['order_id'] );

		wp_send_json_success(array(
			'order' => $order
		));
		return true;
	}
}
