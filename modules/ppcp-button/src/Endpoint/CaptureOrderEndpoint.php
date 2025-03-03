<?php
/**
 * Endpoint to handle PayPal Subscription created.
 *
 * @package WooCommerce\PayPalCommerce\Button\Endpoint
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Button\Endpoint;

use WooCommerce\PayPalCommerce\ApiClient\Endpoint\OrderEndpoint;
use WooCommerce\PayPalCommerce\Button\Exception\RuntimeException;
use WooCommerce\PayPalCommerce\Button\Helper\ContextTrait;
use WooCommerce\PayPalCommerce\Button\Helper\WooCommerceOrderCreator;
use WooCommerce\PayPalCommerce\Session\SessionHandler;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayPalGateway;

/**
 * Class ApproveSubscriptionEndpoint
 */
class CaptureOrderEndpoint implements EndpointInterface {

	use ContextTrait;

	const ENDPOINT = 'ppc-capture-order';

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
     * The WooCommerce order creator.
     *
     * @var WooCommerceOrderCreator
     */
    protected $wc_order_creator;

	/**
	 * ApproveSubscriptionEndpoint constructor.
	 *
	 * @param RequestData             $request_data The request data helper.
	 * @param OrderEndpoint           $order_endpoint The order endpoint.
	 */
	public function __construct(
		RequestData $request_data,
		OrderEndpoint $order_endpoint,
        WooCommerceOrderCreator $wc_order_creator
	) {
		$this->request_data         = $request_data;
		$this->order_endpoint       = $order_endpoint;
        $this->wc_order_creator     = $wc_order_creator;
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
		$order = $this->order_endpoint->capture( $order );
        if ($order->status()->is('COMPLETED')) {
            $wc_order = $this->wc_order_creator->create_from_paypal_order( $order, WC()->cart );
            $order_received_url = $wc_order->get_checkout_order_received_url();

            wp_send_json_success( array( 'order_received_url' => $order_received_url ) );
        }

		wp_send_json_success();
		return true;
	}
}
