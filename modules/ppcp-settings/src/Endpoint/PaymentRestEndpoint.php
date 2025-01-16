<?php
/**
 * REST endpoint to manage the payment methods page.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Endpoint
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Endpoint;

use WooCommerce\PayPalCommerce\Axo\Gateway\AxoGateway;
use WooCommerce\PayPalCommerce\Googlepay\GooglePayGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\BancontactGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\BlikGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\IDealGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\MultibancoGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\MyBankGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\P24Gateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\TrustlyGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\CardButtonGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\CreditCardGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\OXXO\OXXO;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayPalGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayUponInvoice\PayUponInvoiceGateway;
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
	private array $gateways = array(
		PayPalGateway::ID         => array(
			'id'   => 'paypal',
			'icon' => 'payment-method-paypal',
		),
		CardButtonGateway::ID     => array(
			'icon' => 'payment-method-cards',
		),

		CreditCardGateway::ID     => array(
			'icon' => 'payment-method-advanced-cards',
		),
		AxoGateway::ID            => array(
			'icon' => 'payment-method-fastlane',
		),
		ApplePayGateway::ID       => array(
			'icon' => 'payment-method-apple-pay',
		),
		GooglePayGateway::ID      => array(
			'icon' => 'payment-method-google-pay',
		),

		BancontactGateway::ID     => array(
			'icon' => 'payment-method-bancontact',
		),
		BlikGateway::ID           => array(
			'icon' => 'payment-method-blik',
		),
		EPSGateway::ID            => array(
			'icon' => 'payment-method-eps',
		),
		IDealGateway::ID          => array(
			'icon' => 'payment-method-ideal',
		),
		MyBankGateway::ID         => array(
			'icon' => 'payment-method-mybank',
		),
		P24Gateway::ID            => array(
			'icon' => 'payment-method-przelewy24',
		),
		TrustlyGateway::ID        => array(
			'icon' => 'payment-method-trustly',
		),
		MultibancoGateway::ID     => array(
			'icon' => 'payment-method-multibanco',
		),
		PayUponInvoiceGateway::ID => array(
			'icon' => 'payment-method-multibanco',
		),
		OXXO::ID                  => array(
			'icon' => 'payment-method-multibanco',
		),
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

		foreach ( $this->gateways as $key => $value ) {
			if ( ! isset( $all_gateways[ $key ] ) ) {
				continue;
			}

			$gateway = $all_gateways[ $key ];

			$gateway_settings[ $key ] = array(
				'enabled'      => 'yes' === $gateway->enabled,
				'title'        => $gateway->get_title(),
				'description'  => $gateway->get_description(),
				'method_title' => $gateway->get_method_title(),
				'id'           => $this->gateways[ $key ]['id'] ?? $key,
				'icon'         => $this->gateways[ $key ]['icon'] ?? '',
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

		foreach ( $this->gateways as $gateway_id ) {
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
