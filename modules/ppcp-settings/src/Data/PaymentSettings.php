<?php
/**
 * Payment Methods class
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Data;

use RuntimeException;

/**
 * This class serves as a container for managing the payment settings.
 */
class PaymentSettings extends AbstractDataModel {

	/**
	 * Option key where profile details are stored.
	 *
	 * @var string
	 */
	protected const OPTION_KEY = 'woocommerce-ppcp-data-payment';

	/**
	 * Get default values for the model.
	 *
	 * @return array
	 */
	protected function get_defaults() : array {
		return array(
			'paymentMethodsPayPalCheckout'     => array(
				array(
					'id'          => 'paypal',
					'title'       => __( 'PayPal', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximize conversion.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-paypal',
				),
				array(
					'id'          => 'venmo',
					'title'       => __( 'Venmo', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Offer Venmo at checkout to millions of active users.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-venmo',
				),
				array(
					'id'          => 'paypal_credit',
					'title'       => __( 'Pay Later', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Get paid in full at checkout while giving your customers the flexibility to pay in installments over time with no late fees.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-paypal',
				),
				array(
					'id'          => 'credit_and_debit_card_payments',
					'title'       => __(
						'Credit and debit card payments',
						'woocommerce-paypal-payments'
					),
					'description' => __(
						"Accept all major credit and debit cards - even if your customer doesn't have a PayPal account.",
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-cards',
				),
			),
			'paymentMethodsOnlineCardPayments' => array(
				array(
					'id'          => 'advanced_credit_and_debit_card_payments',
					'title'       => __(
						'Advanced Credit and Debit Card Payments',
						'woocommerce-paypal-payments'
					),
					'description' => __(
						"Present custom credit and debit card fields to your payers so they can pay with credit and debit cards using your site's branding.",
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-advanced-cards',
				),
				array(
					'id'          => 'fastlane',
					'title'       => __( 'Fastlane by PayPal', 'woocommerce-paypal-payments' ),
					'description' => __(
						"Tap into the scale and trust of PayPal's customer network to recognize shoppers and make guest checkout more seamless than ever.",
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-fastlane',
				),
				array(
					'id'          => 'apple_pay',
					'title'       => __( 'Apple Pay', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Allow customers to pay via their Apple Pay digital wallet.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-apple-pay',
				),
				array(
					'id'          => 'google_pay',
					'title'       => __( 'Google Pay', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Allow customers to pay via their Google Pay digital wallet.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-google-pay',
				),
			),
			'paymentMethodsAlternative'        => array(
				array(
					'id'          => 'bancontact',
					'title'       => __( 'Bancontact', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Bancontact is the most widely used, accepted and trusted electronic payment method in Belgium. Bancontact makes it possible to pay directly through the online payment systems of all major Belgian banks.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-bancontact',
				),
				array(
					'id'          => 'ideal',
					'title'       => __( 'iDEAL', 'woocommerce-paypal-payments' ),
					'description' => __(
						'iDEAL is a payment method in the Netherlands that allows buyers to select their issuing bank from a list of options.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-ideal',
				),
				array(
					'id'          => 'eps',
					'title'       => __( 'eps', 'woocommerce-paypal-payments' ),
					'description' => __(
						'An online payment method in Austria, enabling Austrian buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-eps',
				),
				array(
					'id'          => 'blik',
					'title'       => __( 'BLIK', 'woocommerce-paypal-payments' ),
					'description' => __(
						'A widely used mobile payment method in Poland, allowing Polish customers to pay directly via their banking apps. Transactions are processed in PLN.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-blik',
				),
				array(
					'id'          => 'mybank',
					'title'       => __( 'MyBank', 'woocommerce-paypal-payments' ),
					'description' => __(
						'A European online banking payment solution primarily used in Italy, enabling customers to make secure bank transfers during checkout. Transactions are processed in EUR.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-mybank',
				),
				array(
					'id'          => 'przelewy24',
					'title'       => __( 'Przelewy24', 'woocommerce-paypal-payments' ),
					'description' => __(
						'A popular online payment gateway in Poland, offering various payment options for Polish customers. Transactions can be processed in PLN or EUR.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-przelewy24',
				),
				array(
					'id'          => 'trustly',
					'title'       => __( 'Trustly', 'woocommerce-paypal-payments' ),
					'description' => __(
						'A European payment method that allows buyers to make payments directly from their bank accounts, suitable for customers across multiple European countries. Supported currencies include EUR, DKK, SEK, GBP, and NOK.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-trustly',
				),
				array(
					'id'          => 'multibanco',
					'title'       => __( 'Multibanco', 'woocommerce-paypal-payments' ),
					'description' => __(
						'An online payment method in Portugal, enabling Portuguese buyers to make secure payments directly through their bank accounts. Transactions are processed in EUR.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-multibanco',
				),
				array(
					'id'          => 'pui',
					'title'       => __( 'Pay upon Invoice', 'woocommerce-paypal-payments' ),
					'description' => __(
						'Pay upon Invoice is an invoice payment method in Germany. It is a local buy now, pay later payment method that allows the buyer to place an order, receive the goods, try them, verify they are in good order, and then pay the invoice within 30 days.',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-ratepay',

				),
				array(
					'id'          => 'oxxo',
					'title'       => __( 'OXXO', 'woocommerce-paypal-payments' ),
					'description' => __(
						'OXXO is a Mexican chain of convenience stores. *Get PayPal account permission to use OXXO payment functionality by contacting us at (+52) 800–925–0304',
						'woocommerce-paypal-payments'
					),
					'icon'        => 'payment-method-oxxo',
				),
			),
		);
	}
}
