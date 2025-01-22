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
	 * @return array[]
	 */
	protected function gateways():array {
		return array(
			// PayPal checkout.
			PayPalGateway::ID         => array(
				'id'               => 'ppcp-gateway',
				'title'            => __( 'PayPal', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximize conversion.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-paypal',
				'itemTitle'       => __( 'PayPal', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximize conversion.',
					'woocommerce-paypal-payments'
				),
				'fields' => array(
					'checkoutPageTitle' => array(
						'type'    => 'text',
						'default' => '',
						'label'   => __( 'Checkout page title', 'woocommerce-paypal-payments' ),
					),
				),
			),
			'venmo'                   => array(
				'id'               => 'venmo',
				'itemTitle'       => __( 'Venmo', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Offer Venmo at checkout to millions of active users.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-venmo',
			),
			'pay-later'               => array(
				'id'               => 'paypal_credit',
				'itemTitle'       => __( 'Pay Later', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Get paid in full at checkout while giving your customers the flexibility to pay in installments over time with no late fees.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-paypal',
			),
			CardButtonGateway::ID     => array(
				'id'               => 'credit_and_debit_card_payments',
				'title'            => __(
					'Credit and debit card payments',
					'woocommerce-paypal-payments'
				),
				'description'      => __(
					"Accept all major credit and debit cards - even if your customer doesn't have a PayPal account.",
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-cards',
				'itemTitle'       => __(
					'Credit and debit card payments',
					'woocommerce-paypal-payments'
				),
				'itemDescription' => __(
					"Accept all major credit and debit cards - even if your customer doesn't have a PayPal account.",
					'woocommerce-paypal-payments'
				),
			),

			// Online card Payments.
			CreditCardGateway::ID     => array(
				'id'               => 'advanced_credit_and_debit_card_payments',
				'title'            => __(
					'Advanced Credit and Debit Card Payments',
					'woocommerce-paypal-payments'
				),
				'description'      => __(
					"Present custom credit and debit card fields to your payers so they can pay with credit and debit cards using your site's branding.",
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-advanced-cards',
				'itemTitle'       => __(
					'Advanced Credit and Debit Card Payments',
					'woocommerce-paypal-payments'
				),
				'itemDescription' => __(
					"Present custom credit and debit card fields to your payers so they can pay with credit and debit cards using your site's branding.",
					'woocommerce-paypal-payments'
				),
			),
			AxoGateway::ID            => array(
				'id'               => 'fastlane',
				'title'            => __( 'Fastlane by PayPal', 'woocommerce-paypal-payments' ),
				'description'      => __(
					"Tap into the scale and trust of PayPal's customer network to recognize shoppers and make guest checkout more seamless than ever.",
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-fastlane',
				'itemTitle'       => __( 'Fastlane by PayPal', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					"Tap into the scale and trust of PayPal's customer network to recognize shoppers and make guest checkout more seamless than ever.",
					'woocommerce-paypal-payments'
				),
			),
			ApplePayGateway::ID       => array(
				'id'               => 'apple_pay',
				'title'            => __( 'Apple Pay', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'Allow customers to pay via their Apple Pay digital wallet.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-apple-pay',
				'itemTitle'       => __( 'Apple Pay', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Allow customers to pay via their Apple Pay digital wallet.',
					'woocommerce-paypal-payments'
				),
			),
			GooglePayGateway::ID      => array(
				'id'               => 'google_pay',
				'title'            => __( 'Google Pay', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'Allow customers to pay via their Google Pay digital wallet.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-google-pay',
				'itemTitle'       => __( 'Google Pay', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Allow customers to pay via their Google Pay digital wallet.',
					'woocommerce-paypal-payments'
				),
			),

			// Alternative payment methods.
			BancontactGateway::ID     => array(
				'id'               => 'bancontact',
				'title'            => __( 'Bancontact', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'Bancontact is the most widely used, accepted and trusted electronic payment method in Belgium. Bancontact makes it possible to pay directly through the online payment systems of all major Belgian banks.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-bancontact',
				'itemTitle'       => __( 'Bancontact', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Bancontact is the most widely used, accepted and trusted electronic payment method in Belgium. Bancontact makes it possible to pay directly through the online payment systems of all major Belgian banks.',
					'woocommerce-paypal-payments'
				),
			),
			BlikGateway::ID           => array(
				'id'               => 'blik',
				'title'            => __( 'BLIK', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'A widely used mobile payment method in Poland, allowing Polish customers to pay directly via their banking apps. Transactions are processed in PLN.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-blik',
				'itemTitle'       => __( 'BLIK', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'A widely used mobile payment method in Poland, allowing Polish customers to pay directly via their banking apps. Transactions are processed in PLN.',
					'woocommerce-paypal-payments'
				),
			),
			EPSGateway::ID            => array(
				'id'               => 'eps',
				'title'            => __( 'eps', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'An online payment method in Austria, enabling Austrian buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-eps',
				'itemTitle'       => __( 'eps', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'An online payment method in Austria, enabling Austrian buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
			),
			IDealGateway::ID          => array(
				'id'               => 'ideal',
				'title'            => __( 'iDEAL', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'iDEAL is a payment method in the Netherlands that allows buyers to select their issuing bank from a list of options.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-ideal',
				'itemTitle'       => __( 'iDEAL', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'iDEAL is a payment method in the Netherlands that allows buyers to select their issuing bank from a list of options.',
					'woocommerce-paypal-payments'
				),
			),
			MyBankGateway::ID         => array(
				'id'               => 'mybank',
				'title'            => __( 'MyBank', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'A European online banking payment solution primarily used in Italy, enabling customers to make secure bank transfers during checkout. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-mybank',
				'itemTitle'       => __( 'MyBank', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'A European online banking payment solution primarily used in Italy, enabling customers to make secure bank transfers during checkout. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
			),
			P24Gateway::ID            => array(
				'id'               => 'przelewy24',
				'title'            => __( 'Przelewy24', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'A popular online payment gateway in Poland, offering various payment options for Polish customers. Transactions can be processed in PLN or EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-przelewy24',
				'itemTitle'       => __( 'Przelewy24', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'A popular online payment gateway in Poland, offering various payment options for Polish customers. Transactions can be processed in PLN or EUR.',
					'woocommerce-paypal-payments'
				),
			),
			TrustlyGateway::ID        => array(
				'id'               => 'trustly',
				'title'            => __( 'Trustly', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'A European payment method that allows buyers to make payments directly from their bank accounts, suitable for customers across multiple European countries. Supported currencies include EUR, DKK, SEK, GBP, and NOK.',
					'woocommerce-paypal-payments'
				),
				'itemTitle'       => __( 'Trustly', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'A European payment method that allows buyers to make payments directly from their bank accounts, suitable for customers across multiple European countries. Supported currencies include EUR, DKK, SEK, GBP, and NOK.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-trustly',
			),
			MultibancoGateway::ID     => array(
				'id'               => 'multibanco',
				'title'            => __( 'Multibanco', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'An online payment method in Portugal, enabling Portuguese buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'             => 'payment-method-multibanco',
				'itemTitle'       => __( 'Multibanco', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'An online payment method in Portugal, enabling Portuguese buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
			),
			PayUponInvoiceGateway::ID => array(
				'id'               => 'pui',
				'title'            => __( 'Pay upon Invoice', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'Pay upon Invoice is an invoice payment method in Germany. It is a local buy now, pay later payment method that allows the buyer to place an order, receive the goods, try them, verify they are in good order, and then pay the invoice within 30 days.',
					'woocommerce-paypal-payments'
				),
				'icon'             => '',
				'itemTitle'       => __( 'Pay upon Invoice', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'Pay upon Invoice is an invoice payment method in Germany. It is a local buy now, pay later payment method that allows the buyer to place an order, receive the goods, try them, verify they are in good order, and then pay the invoice within 30 days.',
					'woocommerce-paypal-payments'
				),
			),
			OXXO::ID                  => array(
				'id'               => 'oxxo',
				'title'            => __( 'OXXO', 'woocommerce-paypal-payments' ),
				'description'      => __(
					'OXXO is a Mexican chain of convenience stores. *Get PayPal account permission to use OXXO payment functionality by contacting us at (+52) 800–925–0304',
					'woocommerce-paypal-payments'
				),
				'icon'             => '',
				'itemTitle'       => __( 'OXXO', 'woocommerce-paypal-payments' ),
				'itemDescription' => __(
					'OXXO is a Mexican chain of convenience stores. *Get PayPal account permission to use OXXO payment functionality by contacting us at (+52) 800–925–0304',
					'woocommerce-paypal-payments'
				),
			),
		);
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
		$all_gateways = WC()->payment_gateways->payment_gateways();

		$gateway_settings = array();

		foreach ( $this->gateways() as $key => $value ) {
			if ( ! isset( $all_gateways[ $key ] ) ) {
				$gateway_settings[ $key ] = array(
					'id'          => $this->gateways()[ $key ]['id'] ?? '',
					'title'       => $this->gateways()[ $key ]['title'] ?? '',
					'description' => $this->gateways()[ $key ]['description'] ?? '',
					'enabled'     => false,
					'icon'        => $this->gateways()[ $key ]['icon'] ?? '',
					'itemTitle'       => $this->gateways()[ $key ]['itemTitle'] ?? '',
					'itemDescription' => $this->gateways()[ $key ]['itemDescription'] ?? '',
				);

				if(isset($this->gateways()[ $key ]['fields'])) {
					$gateway_settings[ $key ]['fields'] = $this->gateways()[ $key ]['fields'];
				}

				continue;
			}

			$gateway = $all_gateways[ $key ];

			$gateway_settings[ $key ] = array(
				'enabled'      => 'yes' === $gateway->enabled,
				'title'        => $gateway->get_title(),
				'description'  => $gateway->get_description(),
				'id'           => $this->gateways()[ $key ]['id'] ?? $key,
				'icon'         => $this->gateways()[ $key ]['icon'] ?? '',
				'itemTitle'       => $this->gateways()[ $key ]['itemTitle'] ?? '',
				'itemDescription' => $this->gateways()[ $key ]['itemDescription'] ?? '',
			);

			if(isset($this->gateways()[ $key ]['fields'])) {
				$gateway_settings[ $key ]['fields'] = $this->gateways()[ $key ]['fields'];
			}
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
		$all_gateways = WC()->payment_gateways->payment_gateways();

		$request_data = $request->get_params();

		foreach ( $this->gateways() as $key => $value ) {
			// Check if the REST body contains details for this gateway.
			if ( ! isset( $request_data[ $key ] ) || ! isset( $all_gateways[ $key ] ) ) {
				continue;
			}

			$gateway  = $all_gateways[ $key ];
			$new_data = $request_data[ $key ];
			$gateway->init_form_fields();
			$settings = $gateway->settings;

			if ( isset( $new_data['enabled'] ) ) {
				$settings['enabled'] = wc_bool_to_string( $new_data['enabled'] );
				$gateway->enabled    = $settings['enabled'];
			}

			if ( isset( $new_data['title'] ) ) {
				$settings['title'] = sanitize_text_field( $new_data['title'] );
				$gateway->title    = $settings['title'];
			}

			if ( isset( $new_data['description'] ) ) {
				$settings['description'] = wp_kses_post( $new_data['description'] );
				$gateway->description    = $settings['description'];
			}

			$gateway->settings = $settings;
			update_option( $gateway->get_option_key(), $settings );
		}

		return $this->get_details();
	}
}
