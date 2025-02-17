<?php
/**
 * PayPal Commerce Features Definitions
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data\Definition
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Settings\Data\Definition;

use WooCommerce\PayPalCommerce\Settings\Service\FeaturesEligibilityService;
use WooCommerce\PayPalCommerce\Settings\Data\GeneralSettings;

/**
 * Class FeaturesDefinition
 *
 * Provides the definitions for all available features in the system.
 * Each feature has a title, description, eligibility condition, and associated action.
 */
class FeaturesDefinition
{

	/**
	 * The features eligibility service.
	 *
	 * @var FeaturesEligibilityService
	 */
	protected FeaturesEligibilityService $eligibilities;

	/**
	 * The general settings service.
	 *
	 * @var GeneralSettings
	 */
	protected GeneralSettings $settings;

	/**
	 * Constructor.
	 *
	 * @param FeaturesEligibilityService $eligibilities The features eligibility service.
	 * @param GeneralSettings $settings The general settings service.
	 */
	public function __construct(
		FeaturesEligibilityService $eligibilities,
		GeneralSettings            $settings
	)
	{
		$this->eligibilities = $eligibilities;
		$this->settings = $settings;
	}

	/**
	 * Returns the full list of feature definitions with their eligibility conditions.
	 *
	 * @return array The array of feature definitions.
	 */
	public function get(): array
	{
		$eligibility_checks = $this->eligibilities->get_eligibility_checks();
		$paylaterCountries = [
			'UK',
			'ES',
			'IT',
			'FR',
			'US',
			'DE',
			'AU',
		];
		$storeCountry = $this->settings->get_woo_settings()['country'];
		$countryLocation = in_array($storeCountry, $paylaterCountries) ? strtolower($storeCountry) : 'us';

		return array(
			'save_paypal_and_venmo' => array(
				'title' => __('Save PayPal and Venmo', 'woocommerce-paypal-payments'),
				'description' => __('Securely save PayPal and Venmo payment methods for subscriptions or return buyers.', 'woocommerce-paypal-payments'),
				'isEligible' => $eligibility_checks['save_paypal_and_venmo'],
				'buttons' => array(
					array(
						'type' => 'secondary',
						'text' => __('Configure', 'woocommerce-paypal-payments'),
						'action'      => array(
							'type' => 'tab',
							'tab'  => 'settings',
							'section' => 'ppcp--save-payment-methods',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'secondary',
						'text' => __('Sign up', 'woocommerce-paypal-payments'),
						'urls' => array(
							'sandbox' => 'https://www.sandbox.paypal.com/bizsignup/entry?product=ADVANCED_VAULTING',
							'live' => 'https://www.paypal.com/bizsignup/entry?product=ADVANCED_VAULTING',
						),
						'showWhen' => 'disabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'tertiary',
						'text' => __('Learn more', 'woocommerce-paypal-payments'),
						'url' => 'https://www.paypal.com/us/enterprise/payment-processing/accept-venmo',
						'class' => 'small-button',
					),
				),
			),
			'advanced_credit_and_debit_cards' => array(
				'title' => __('Advanced Credit and Debit Cards', 'woocommerce-paypal-payments'),
				'description' => __('Process major credit and debit cards including Visa, Mastercard, American Express and Discover.', 'woocommerce-paypal-payments'),
				'isEligible' => $eligibility_checks['advanced_credit_and_debit_cards'],
				'buttons' => array(
					array(
						'type' => 'secondary',
						'text' => __('Configure', 'woocommerce-paypal-payments'),
						'action'      => array(
							'type' => 'tab',
							'tab'  => 'payment_methods',
							'section' => 'ppcp-card-payments-card',
							'modal' => 'ppcp-credit-card-gateway',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'secondary',
						'text' => __('Sign up', 'woocommerce-paypal-payments'),
						'urls' => array(
							'sandbox' => 'https://www.sandbox.paypal.com/bizsignup/entry?product=ppcp',
							'live' => 'https://www.paypal.com/bizsignup/entry?product=ppcp',
						),
						'showWhen' => 'disabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'tertiary',
						'text' => __('Learn more', 'woocommerce-paypal-payments'),
						'url' => 'https://developer.paypal.com/studio/checkout/advanced',
						'class' => 'small-button',
					),
				),
			),
			'alternative_payment_methods' => array(
				'title' => __('Alternative Payment Methods', 'woocommerce-paypal-payments'),
				'description' => __('Offer global, country-specific payment options for your customers.', 'woocommerce-paypal-payments'),
				'isEligible' => $eligibility_checks['alternative_payment_methods'],
				'buttons' => array(
					array(
						'type' => 'secondary',
						'text' => __('Configure', 'woocommerce-paypal-payments'),
						'action'      => array(
							'type' => 'tab',
							'tab'  => 'payment_methods',
							'section' => 'ppcp-alternative-payments-card',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'secondary',
						'text' => __('Sign up', 'woocommerce-paypal-payments'),
						'url' => 'https://developer.paypal.com/docs/checkout/apm/',
						'showWhen' => 'disabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'tertiary',
						'text' => __('Learn more', 'woocommerce-paypal-payments'),
						'url' => 'https://developer.paypal.com/docs/checkout/apm/',
						'class' => 'small-button',
					),
				),
			),
			'google_pay' => array(
				'title' => __('Google Pay', 'woocommerce-paypal-payments'),
				'description' => __('Let customers pay using their Google Pay wallet.', 'woocommerce-paypal-payments'),
				'isEligible' => $eligibility_checks['google_pay'],
				'buttons' => array(
					array(
						'type' => 'secondary',
						'text' => __('Configure', 'woocommerce-paypal-payments'),
						'action'      => array(
							'type' => 'tab',
							'tab'  => 'payment_methods',
							'section' => 'ppcp-card-payments-card',
							'modal' => 'ppcp-googlepay',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'secondary',
						'text' => __('Sign up', 'woocommerce-paypal-payments'),
						'urls' => array(
							'sandbox' => 'https://www.sandbox.paypal.com/bizsignup/add-product?product=payment_methods&capabilities=GOOGLE_PAY',
							'live' => 'https://www.paypal.com/bizsignup/add-product?product=payment_methods&capabilities=GOOGLE_PAY',
						),
						'showWhen' => 'disabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'tertiary',
						'text' => __('Learn more', 'woocommerce-paypal-payments'),
						'url' => 'https://developer.paypal.com/docs/checkout/apm/google-pay/',
						'class' => 'small-button',
					),
				),
				'notes' => array(
					__('¹PayPal Q2 Earnings-2021.', 'woocommerce-paypal-payments'),
				),
			),
			'apple_pay' => array(
				'title' => __('Apple Pay', 'woocommerce-paypal-payments'),
				'description' => __('Let customers pay using their Apple Pay wallet.', 'woocommerce-paypal-payments'),
				'isEligible' => $eligibility_checks['apple_pay'],
				'buttons' => array(
					array(
						'type' => 'secondary',
						'text' => __('Configure', 'woocommerce-paypal-payments'),
						'action'      => array(
							'type' => 'tab',
							'tab'  => 'payment_methods',
							'section' => 'ppcp-card-payments-card',
							'modal' => 'ppcp-applepay',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'secondary',
						'text' => __('Domain registration', 'woocommerce-paypal-payments'),
						'urls' => array(
							'sandbox' => 'https://www.sandbox.paypal.com/uccservicing/apm/applepay',
							'live' => 'https://www.paypal.com/uccservicing/apm/applepay',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'secondary',
						'text' => __('Sign up', 'woocommerce-paypal-payments'),
						'urls' => array(
							'sandbox' => 'https://www.sandbox.paypal.com/bizsignup/add-product?product=payment_methods&capabilities=APPLE_PAY',
							'live' => 'https://www.paypal.com/bizsignup/add-product?product=payment_methods&capabilities=APPLE_PAY',
						),
						'showWhen' => 'disabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'tertiary',
						'text' => __('Learn more', 'woocommerce-paypal-payments'),
						'url' => 'https://developer.paypal.com/docs/checkout/apm/apple-pay/',
						'class' => 'small-button',
					),
				),
			),
			'pay_later' => array(
				'title' => __('Pay Later Messaging', 'woocommerce-paypal-payments'),
				'description' => __(
					'Let customers know they can buy now and pay later with PayPal. Adding this messaging can boost conversion rates and increase cart sizes by 39%¹, with no extra cost to you—plus, you get paid up front.',
					'woocommerce-paypal-payments'
				),
				'isEligible' => $eligibility_checks['pay_later'],
				'buttons' => array(
					array(
						'type' => 'secondary',
						'text' => __('Configure', 'woocommerce-paypal-payments'),
						'action'      => array(
							'type' => 'tab',
							'tab'  => 'pay_later_messaging',
						),
						'showWhen' => 'enabled',
						'class' => 'small-button',
					),
					array(
						'type' => 'tertiary',
						'text' => __('Learn more', 'woocommerce-paypal-payments'),
						'url' => "https://www.paypal.com/$countryLocation/business/accept-payments/checkout/installments",
						'class' => 'small-button',
					),
				),
			),
		);
	}
}
