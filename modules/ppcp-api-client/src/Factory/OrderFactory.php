<?php
/**
 * The Order factory.
 *
 * @package WooCommerce\PayPalCommerce\ApiClient\Factory
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\ApiClient\Factory;

use WooCommerce\PayPalCommerce\ApiClient\Entity\Order;
use WooCommerce\PayPalCommerce\ApiClient\Entity\OrderStatus;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PaymentSource;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PurchaseUnit;
use WooCommerce\PayPalCommerce\ApiClient\Exception\RuntimeException;

/**
 * Class OrderFactory
 */
class OrderFactory {

	/**
	 * The PurchaseUnit factory.
	 *
	 * @var PurchaseUnitFactory
	 */
	private $purchase_unit_factory;

	/**
	 * The Payer factory.
	 *
	 * @var PayerFactory
	 */
	private $payer_factory;



	/**
	 * OrderFactory constructor.
	 *
	 * @param PurchaseUnitFactory $purchase_unit_factory The PurchaseUnit factory.
	 * @param PayerFactory        $payer_factory The Payer factory.
	 */
	public function __construct(
		PurchaseUnitFactory $purchase_unit_factory,
		PayerFactory $payer_factory
	) {

		$this->purchase_unit_factory = $purchase_unit_factory;
		$this->payer_factory         = $payer_factory;
	}

	/**
	 * Creates an Order object based off a WooCommerce order and another Order object.
	 *
	 * @param \WC_Order $wc_order The WooCommerce order.
	 * @param Order     $order The order object.
	 *
	 * @return Order
	 */
	public function from_wc_order( \WC_Order $wc_order, Order $order ): Order {
		$purchase_units = array( $this->purchase_unit_factory->from_wc_order( $wc_order ) );

		return new Order(
			$order->id(),
			$purchase_units,
			$order->status(),
			$order->payment_source(),
			$order->payer(),
			$order->intent(),
			$order->create_time(),
			$order->update_time()
		);
	}

	/**
	 * Returns an Order object based off a PayPal Response.
	 *
	 * @param \stdClass $order_data The JSON object.
	 *
	 * @return Order
	 * @throws RuntimeException When JSON object is malformed.
	 */
	public function from_paypal_response( \stdClass $order_data ): Order {
		return $this->create_order_from_response( $order_data, false );
	}

	/**
	 * Returns an Order object based off a PayPal 3DS Response.
	 *
	 * @param \stdClass $order_data The JSON object.
	 *
	 * @return Order
	 * @throws RuntimeException When JSON object is malformed.
	 */
	public function from_paypal_response_with_3ds( \stdClass $order_data ): Order {
		return $this->create_order_from_response( $order_data, true );
	}

	/**
	 * Creates an Order object from PayPal response data.
	 *
	 * @param \stdClass $order_data The JSON object.
	 * @param bool      $is_3ds_response Whether this is a 3DS response.
	 *
	 * @return Order
	 * @throws RuntimeException When JSON object is malformed.
	 */
	private function create_order_from_response( \stdClass $order_data, bool $is_3ds_response ): Order {
		$this->validate_order_id( $order_data );

		$purchase_units = $this->create_purchase_units( $order_data, $is_3ds_response );
		$status = $this->create_order_status( $order_data, $is_3ds_response );
		$intent = $this->get_intent( $order_data, $is_3ds_response );
		$timestamps = $this->create_timestamps( $order_data, $is_3ds_response );
		$payer = $this->create_payer( $order_data, $is_3ds_response );
		$payment_source = $this->create_payment_source( $order_data );
		$links = $is_3ds_response ? ( $order_data->links ?? null ) : null;

		return new Order(
			$order_data->id,
			$purchase_units,
			$status,
			$payment_source,
			$payer,
			$intent,
			$timestamps['create_time'],
			$timestamps['update_time'],
			$links
		);
	}

	/**
	 * Validates that the order data contains a required ID.
	 *
	 * @param \stdClass $order_data The order data.
	 *
	 * @throws RuntimeException When ID is missing.
	 */
	private function validate_order_id( \stdClass $order_data ): void {
		if ( ! isset( $order_data->id ) ) {
			throw new RuntimeException(
				__( 'Order does not contain an id.', 'woocommerce-paypal-payments' )
			);
		}
	}

	/**
	 * Creates purchase units from order data.
	 *
	 * @param \stdClass $order_data The order data.
	 * @param bool      $is_3ds_response Whether this is a 3DS response.
	 *
	 * @return array Array of PurchaseUnit objects.
	 * @throws RuntimeException When purchase units are required but missing.
	 */
	private function create_purchase_units( \stdClass $order_data, bool $is_3ds_response ): array {
		// 3DS responses don't contain purchase units.
		if ( $is_3ds_response ) {
			return array();
		}

		if ( ! isset( $order_data->purchase_units ) || ! is_array( $order_data->purchase_units ) ) {
			throw new RuntimeException(
				__( 'Order does not contain items.', 'woocommerce-paypal-payments' )
			);
		}

		return array_map(
			function ( \stdClass $data ): PurchaseUnit {
				return $this->purchase_unit_factory->from_paypal_response( $data );
			},
			$order_data->purchase_units
		);
	}

	/**
	 * Creates order status from order data.
	 *
	 * @param \stdClass $order_data The order data.
	 * @param bool      $is_3ds_response Whether this is a 3DS response.
	 *
	 * @return OrderStatus
	 * @throws RuntimeException When status is required but missing.
	 */
	private function create_order_status( \stdClass $order_data, bool $is_3ds_response ): OrderStatus {
		if ( $is_3ds_response ) {
			$status_value = $order_data->status ?? 'PAYER_ACTION_REQUIRED';
			return new OrderStatus( $status_value );
		}

		if ( ! isset( $order_data->status ) ) {
			throw new RuntimeException(
				__( 'Order does not contain status.', 'woocommerce-paypal-payments' )
			);
		}

		return new OrderStatus( $order_data->status );
	}

	/**
	 * Gets the intent from order data.
	 *
	 * @param \stdClass $order_data The order data.
	 * @param bool      $is_3ds_response Whether this is a 3DS response.
	 *
	 * @return string
	 * @throws RuntimeException When intent is required but missing.
	 */
	private function get_intent( \stdClass $order_data, bool $is_3ds_response ): string {
		if ( $is_3ds_response ) {
			return $order_data->intent ?? 'CAPTURE';
		}

		if ( ! isset( $order_data->intent ) ) {
			throw new RuntimeException(
				__( 'Order does not contain intent.', 'woocommerce-paypal-payments' )
			);
		}

		return $order_data->intent;
	}

	/**
	 * Creates timestamps from order data.
	 *
	 * @param \stdClass $order_data The order data.
	 * @param bool      $is_3ds_response Whether this is a 3DS response.
	 *
	 * @return array Array with 'create_time' and 'update_time' keys.
	 */
	private function create_timestamps( \stdClass $order_data, bool $is_3ds_response ): array {
		if ( $is_3ds_response ) {
			return array(
				'create_time' => null,
				'update_time' => null,
			);
		}

		$create_time = isset( $order_data->create_time ) ?
			\DateTime::createFromFormat( 'Y-m-d\TH:i:sO', $order_data->create_time ) :
			null;

		$update_time = isset( $order_data->update_time ) ?
			\DateTime::createFromFormat( 'Y-m-d\TH:i:sO', $order_data->update_time ) :
			null;

		return array(
			'create_time' => $create_time,
			'update_time' => $update_time,
		);
	}

	/**
	 * Creates payer from order data.
	 *
	 * @param \stdClass $order_data The order data.
	 * @param bool      $is_3ds_response Whether this is a 3DS response.
	 *
	 * @return mixed Payer object or null.
	 */
	private function create_payer( \stdClass $order_data, bool $is_3ds_response ) {
		if ( $is_3ds_response ) {
			return null;
		}

		return isset( $order_data->payer ) ?
			$this->payer_factory->from_paypal_response( $order_data->payer ) :
			null;
	}

	/**
	 * Creates payment source from order data.
	 *
	 * @param \stdClass $order_data The order data.
	 *
	 * @return PaymentSource|null
	 */
	private function create_payment_source( \stdClass $order_data ): ?PaymentSource {
		if ( ! isset( $order_data->payment_source ) ) {
			return null;
		}

		$json_encoded_payment_source = wp_json_encode( $order_data->payment_source );
		if ( ! $json_encoded_payment_source ) {
			return null;
		}

		$payment_source_as_array = json_decode( $json_encoded_payment_source, true );
		if ( ! $payment_source_as_array ) {
			return null;
		}

		$source_name = array_key_first( $payment_source_as_array );
		if ( ! $source_name ) {
			return null;
		}

		return new PaymentSource(
			$source_name,
			$order_data->payment_source->$source_name
		);
	}
}
