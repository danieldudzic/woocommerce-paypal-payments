<?php
/**
 * PayPal Commerce Todos Definitions
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data\Definition
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Data\Definition;

use WooCommerce\PayPalCommerce\Applepay\ApplePayGateway;
use WooCommerce\PayPalCommerce\Axo\Gateway\AxoGateway;
use WooCommerce\PayPalCommerce\Googlepay\GooglePayGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\BancontactGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\BlikGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\EPSGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\IDealGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\MultibancoGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\MyBankGateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\P24Gateway;
use WooCommerce\PayPalCommerce\LocalAlternativePaymentMethods\TrustlyGateway;
use WooCommerce\PayPalCommerce\Settings\Data\PaymentSettings;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\CardButtonGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\CreditCardGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\OXXO\OXXO;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayPalGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayUponInvoice\PayUponInvoiceGateway;

/**
 * Class PaymentMethodsDefinition
 *
 * Provides a list of all payment methods that are available in the settings UI.
 */
class PaymentMethodsDefinition {
	/**
	 * Data model that manages the payment method configuration.
	 *
	 * @var PaymentSettings
	 */
	private PaymentSettings $settings;

	/**
	 * List of WooCommerce payment gateways.
	 *
	 * @var array|null
	 */
	private ?array $wc_gateways = null;

	/**
	 * Constructor.
	 *
	 * @param PaymentSettings $settings Payment methods data model.
	 */
	public function __construct( PaymentSettings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Returns the payment method definitions.
	 *
	 * @return array
	 */
	public function get_definitions() : array {
		// Refresh the WooCommerce gateway details before we build the definitions.
		$this->wc_gateways = WC()->payment_gateways()->payment_gateways();

		$paypal_methods = $this->group_paypal_methods();
		$card_methods   = $this->group_card_methods();
		$apm_methods    = $this->group_apms();

		$all_methods = array_merge( $paypal_methods, $card_methods, $apm_methods );

		$result = array();
		foreach ( $all_methods as $method ) {
			$result[ $method['id'] ] = $method;
		}

		return $result;
	}

	/**
	 * Returns a new payment method configuration array that contains all
	 * common attributes which must be present in every method definition.
	 *
	 * @param string $gateway_id   The payment method ID.
	 * @param string $title        Admin-side payment method title.
	 * @param string $description  Admin-side info about the payment method.
	 * @param string $icon         Admin-side icon of the payment method.
	 * @param array  $extra_fields Optional. Additional fields to display in the edit modal.
	 * @return array Payment method definition.
	 */
	private function define_common_fields(
		string $gateway_id,
		string $title,
		string $description,
		string $icon,
		array $extra_fields = array()
	) : array {
		$gateway = $this->wc_gateways[ $gateway_id ] ?? null;

		$gateway_title       = $gateway ? $gateway->get_title() : $title;
		$gateway_description = $gateway ? $gateway->get_description() : $description;

		$fields = array(
			'checkoutPageTitle'       => array(
				'type'    => 'text',
				'default' => $gateway_title,
				'label'   => __( 'Checkout page title', 'woocommerce-paypal-payments' ),
			),
			'checkoutPageDescription' => array(
				'type'    => 'text',
				'default' => $gateway ? $gateway->get_description() : '',
				'label'   => __( 'Checkout page description', 'woocommerce-paypal-payments' ),
			),
		);

		if ( $extra_fields ) {
			$fields = array_merge( $fields, $extra_fields );
		}

		return array(
			'id'              => $gateway_id,
			'enabled'         => $this->settings->is_method_enabled( $gateway_id ),
			'title'           => str_replace( '&amp;', '&', $gateway_title ),
			'description'     => $gateway_description,
			'icon'            => $icon,
			'itemTitle'       => $title,
			'itemDescription' => $description,
			'fields'          => $fields,
		);
	}

	// Payment method groups.

	/**
	 * Define PayPal related payment methods.
	 *
	 * @return array
	 */
	private function group_paypal_methods() : array {
		return array(
			$this->define_paypal(),
			$this->define_venmo(),
			$this->define_pay_later(),
			$this->define_card_button(),
		);
	}

	/**
	 * Define card related payment methods.
	 *
	 * @return array
	 */
	private function group_card_methods() : array {
		return array(
			$this->define_advanced_cards(),
			$this->define_axo(),
			$this->define_apple_pay(),
			$this->define_google_pay(),
		);
	}

	/**
	 * Builds an array of payment method definitions, which includes details
	 * of all APM gateways.
	 *
	 * @return array List of payment method definitions.
	 */
	private function group_apms() : array {
		$apm_list = array(
			array(
				'id'          => BancontactGateway::ID,
				'title'       => __( 'Bancontact', 'woocommerce-paypal-payments' ),
				'description' => __(
					'Bancontact is the most widely used, accepted and trusted electronic payment method in Belgium. Bancontact makes it possible to pay directly through the online payment systems of all major Belgian banks.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-bancontact',
			),
			array(
				'id'          => BlikGateway::ID,
				'title'       => __( 'BLIK', 'woocommerce-paypal-payments' ),
				'description' => __(
					'A widely used mobile payment method in Poland, allowing Polish customers to pay directly via their banking apps. Transactions are processed in PLN.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-blik',
			),
			array(
				'id'          => EPSGateway::ID,
				'title'       => __( 'eps', 'woocommerce-paypal-payments' ),
				'description' => __(
					'An online payment method in Austria, enabling Austrian buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-eps',
			),
			array(
				'id'          => IDealGateway::ID,
				'title'       => __( 'iDEAL', 'woocommerce-paypal-payments' ),
				'description' => __(
					'iDEAL is a payment method in the Netherlands that allows buyers to select their issuing bank from a list of options.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-ideal',
			),
			array(
				'id'          => MyBankGateway::ID,
				'title'       => __( 'MyBank', 'woocommerce-paypal-payments' ),
				'description' => __(
					'A European online banking payment solution primarily used in Italy, enabling customers to make secure bank transfers during checkout. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-mybank',
			),
			array(
				'id'          => P24Gateway::ID,
				'title'       => __( 'Przelewy24', 'woocommerce-paypal-payments' ),
				'description' => __(
					'A popular online payment gateway in Poland, offering various payment options for Polish customers. Transactions can be processed in PLN or EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-przelewy24',
			),
			array(
				'id'          => TrustlyGateway::ID,
				'title'       => __( 'Trustly', 'woocommerce-paypal-payments' ),
				'description' => __(
					'A European payment method that allows buyers to make payments directly from their bank accounts, suitable for customers across multiple European countries. Supported currencies include EUR, DKK, SEK, GBP, and NOK.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-trustly',
			),
			array(
				'id'          => MultibancoGateway::ID,
				'title'       => __( 'Multibanco', 'woocommerce-paypal-payments' ),
				'description' => __(
					'An online payment method in Portugal, enabling Portuguese buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-multibanco',
			),
			array(
				'id'          => PayUponInvoiceGateway::ID,
				'title'       => __( 'Pay upon Invoice', 'woocommerce-paypal-payments' ),
				'description' => __(
					'Pay upon Invoice is an invoice payment method in Germany. It is a local buy now, pay later payment method that allows the buyer to place an order, receive the goods, try them, verify they are in good order, and then pay the invoice within 30 days.',
					'woocommerce-paypal-payments'
				),
				'icon'        => '',
			),
			array(
				'id'          => OXXO::ID,
				'title'       => __( 'OXXO', 'woocommerce-paypal-payments' ),
				'description' => __(
					'OXXO is a Mexican chain of convenience stores. *Get PayPal account permission to use OXXO payment functionality by contacting us at (+52) 800–925–0304',
					'woocommerce-paypal-payments'
				),
				'icon'        => 'payment-method-oxxo',
			),
		);

		return array_map(
			function ( $apm ) {
				return $this->define_common_fields(
					$apm['id'],
					$apm['title'],
					$apm['description'],
					$apm['icon']
				);
			},
			$apm_list
		);
	}

	// Payment method specific definitions.

	/**
	 * Builds the payment method definition for PayPal.
	 *
	 * @return array Payment method definition.
	 */
	private function define_paypal() : array {
		return $this->define_common_fields(
			PayPalGateway::ID,
			__( 'PayPal', 'woocommerce-paypal-payments' ),
			__( 'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximize conversion.', 'woocommerce-paypal-payments' ),
			'payment-method-paypal',
			array(
				'paypalShowLogo' => array(
					'type'    => 'toggle',
					'default' => $this->settings->get_paypal_show_logo(),
					'label'   => __( 'Show logo', 'woocommerce-paypal-payments' ),
				),
			)
		);
	}

	/**
	 * Builds the payment method definition for Venmo.
	 *
	 * @return array Payment method definition.
	 */
	private function define_venmo() : array {
		$gateway = $this->define_common_fields(
			'venmo',
			__( 'Venmo', 'woocommerce-paypal-payments' ),
			__(
				'Offer Venmo at checkout to millions of active users.',
				'woocommerce-paypal-payments'
			),
			'payment-method-venmo',
		);

		unset( $gateway['fields'] );

		return $gateway;
	}

	/**
	 * Builds the payment method definition for Pay Later.
	 *
	 * @return array Payment method definition.
	 */
	private function define_pay_later() : array {
		$gateway = $this->define_common_fields(
			'pay-later',
			__( 'Pay Later', 'woocommerce-paypal-payments' ),
			__(
				'Get paid in full at checkout while giving your customers the flexibility to pay in installments over time with no late fees.',
				'woocommerce-paypal-payments'
			),
			'payment-method-paypal',
		);

		unset( $gateway['fields'] );

		return $gateway;
	}

	/**
	 * Builds the payment method definition for Credit Card Button.
	 *
	 * @return array Payment method definition.
	 */
	private function define_card_button() : array {
		return $this->define_common_fields(
			CardButtonGateway::ID,
			__( 'Credit and debit card payments', 'woocommerce-paypal-payments' ),
			__( "Accept all major credit and debit cards - even if your customer doesn't have a PayPal account.", 'woocommerce-paypal-payments' ),
			'payment-method-cards',
		);
	}

	/**
	 * Builds the payment method definition for Advanced Card Payments.
	 *
	 * @return array Payment method definition.
	 */
	private function define_advanced_cards() : array {
		return $this->define_common_fields(
			CreditCardGateway::ID,
			__( 'Advanced Credit and Debit Card Payments', 'woocommerce-paypal-payments' ),
			__( "Present custom credit and debit card fields to your payers so they can pay with credit and debit cards using your site's branding.", 'woocommerce-paypal-payments' ),
			'payment-method-advanced-cards',
			array(
				'threeDSecure' => array(
					'type'        => 'radio',
					'default'     => $this->settings->get_three_d_secure(),
					'label'       => __( '3D Secure', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Authenticate cardholders through their card issuers to reduce fraud and improve transaction security. Successful 3D Secure authentication can shift liability for fraudulent chargebacks to the card issuer.',
						'woocommerce-paypal-payments'
					),
					'options'     => array(
						array(
							'label' => __(
								'No 3D Secure',
								'woocommerce-paypal-payments'
							),
							'value' => 'no-3d-secure',
						),
						array(
							'label' => __(
								'Only when required',
								'woocommerce-paypal-payments'
							),
							'value' => 'only-required-3d-secure',
						),
						array(
							'label' => __(
								'Always require 3D Secure',
								'woocommerce-paypal-payments'
							),
							'value' => 'always-3d-secure',
						),
					),
				),
			),
		);
	}

	/**
	 * Builds the payment method definition for Fastlane.
	 *
	 * @return array Payment method definition.
	 */
	private function define_axo() : array {
		return $this->define_common_fields(
			AxoGateway::ID,
			__( 'Fastlane by PayPal', 'woocommerce-paypal-payments' ),
			__( "Tap into the scale and trust of PayPal's customer network to recognize shoppers and make guest checkout more seamless than ever.", 'woocommerce-paypal-payments' ),
			'payment-method-fastlane',
			array(
				'fastlaneCardholderName'   => array(
					'type'    => 'toggle',
					'default' => $this->settings->get_fastlane_cardholder_name(),
					'label'   => __(
						'Display cardholder name',
						'woocommerce-paypal-payments'
					),
				),
				'fastlaneDisplayWatermark' => array(
					'type'    => 'toggle',
					'default' => $this->settings->get_fastlane_display_watermark(),
					'label'   => __(
						'Display Fastlane Watermark',
						'woocommerce-paypal-payments'
					),
				),
			),
		);
	}

	/**
	 * Builds the payment method definition for Apple Pay.
	 *
	 * @return array Payment method definition.
	 */
	private function define_apple_pay() : array {
		return $this->define_common_fields(
			ApplePayGateway::ID,
			__( 'Apple Pay', 'woocommerce-paypal-payments' ),
			__( 'Allow customers to pay via their Apple Pay digital wallet.', 'woocommerce-paypal-payments' ),
			'payment-method-apple-pay',
		);
	}

	/**
	 * Builds the payment method definition for Google Pay.
	 *
	 * @return array Payment method definition.
	 */
	private function define_google_pay() : array {
		return $this->define_common_fields(
			GooglePayGateway::ID,
			__( 'Google Pay', 'woocommerce-paypal-payments' ),
			__( 'Allow customers to pay via their Google Pay digital wallet.', 'woocommerce-paypal-payments' ),
			'payment-method-google-pay',
		);
	}
}
