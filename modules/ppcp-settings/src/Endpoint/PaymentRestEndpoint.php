<?php
/**
 * REST endpoint to manage the payment methods page.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Endpoint
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Endpoint;

use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;
use WooCommerce\PayPalCommerce\Applepay\ApplePayGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\EPSGateway;

/**
 * REST controller for the "Payment Methods" settings tab.
 *
 * This API acts as the intermediary between the "external world" and our
 * internal data model.
 */
class PaymentRestEndpoint extends RestEndpoint {
	/**
	 * The base path for this REST controller.
	 *
	 * @var string
	 */
	protected $rest_base = 'payment';

	/**
	 * Field mapping for request to profile transformation.
	 *
	 * @var array
	 */
	private array $gateway_ids = array(
		'ppcp-gateway',
		'ppcp-credit-card-gateway',
		ApplePayGateway::ID,
		EPSGateway::ID,
		// Todo: Add all payment methods. Maybe via a filter instead of hard-coding it?
	);

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Todo: Add DI instead of using `WC()->payment_gateways->payment_gateways()`?
	}

	/**
	 * Configure REST API routes.
	 */
	public function register_routes() : void {
		/**
		 * GET wc/v3/wc_paypal/payment
		 */
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_details' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		/**
		 * POST wc/v3/wc_paypal/payment
		 * {
		 *     [gateway_id]: {
		 *         enabled
		 *         title
		 *         description
		 *     }
		 * }
		 */
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_details' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	/**
	 * Returns all payment methods details.
	 *
	 * @return WP_REST_Response The current payment methods details.
	 */
	public function get_details() : WP_REST_Response {
		// Todo: Change this to DI?
		$all_gateways = WC()->payment_gateways->payment_gateways();

		$gateway_settings = array();

		foreach ( $this->gateway_ids as $gateway_id ) {
			if ( ! isset( $all_gateways[ $gateway_id ] ) ) {
				continue;
			}

			$gateway = $all_gateways[ $gateway_id ];

			$gateway_settings[ $gateway_id ] = array(
				'enabled'      => 'yes' === $gateway->enabled,
				'title'        => $gateway->get_title(),
				'description'  => $gateway->get_description(),
				'method_title' => $gateway->get_method_title(),
				'icon'         => $gateway->get_icon(),
			);
		}

		return $this->return_success( $gateway_settings );
	}

	/**
	 * Updates payment methods details based on the request.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response The updated payment methods details.
	 */
	public function update_details( WP_REST_Request $request ) : WP_REST_Response {
		// Todo: Change this to DI?
		$all_gateways = WC()->payment_gateways->payment_gateways();

		$request_data = $request->get_params();

		foreach ( $this->gateway_ids as $gateway_id ) {
			// Check if the REST body contains details for this gateway.
			if ( ! isset( $request_data[ $gateway_id ] ) || ! isset( $all_gateways[ $gateway_id ] ) ) {
				continue;
			}

			$gateway  = $all_gateways[ $gateway_id ];
			$new_data = $request_data[ $gateway_id ];

			if ( isset( $new_data['enabled'] ) ) {
				$gateway->update_option( 'enabled', $new_data['enabled'] ? 'yes' : 'no' );
			}
			if ( isset( $new_data['title'] ) ) {
				$gateway->update_option( 'title', sanitize_text_field( $new_data['title'] ) );
			}
			if ( isset( $new_data['description'] ) ) {
				$gateway->update_option( 'description', wp_kses_post( $new_data['description'] ) );
			}

			$gateway->process_admin_options();
		}

		return $this->get_details();
	}
}
