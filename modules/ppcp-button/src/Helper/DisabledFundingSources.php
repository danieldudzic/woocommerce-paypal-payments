<?php
/**
 * Creates the list of disabled funding sources.
 *
 * @package WooCommerce\PayPalCommerce\Button\Helper
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Button\Helper;

use WooCommerce\PayPalCommerce\WcGateway\Exception\NotFoundException;
use WooCommerce\PayPalCommerce\WcGateway\Settings\Settings;
use WooCommerce\PayPalCommerce\WcSubscriptions\FreeTrialHandlerTrait;
use WooCommerce\PayPalCommerce\WcGateway\Helper\CardPaymentsConfiguration;

/**
 * Class DisabledFundingSources
 */
class DisabledFundingSources {

	use FreeTrialHandlerTrait;

	/**
	 * The settings.
	 *
	 * @var Settings
	 */
	private Settings $settings;

	/**
	 * All existing funding sources.
	 *
	 * @var array
	 */
	private array $all_funding_sources;

	/**
	 * Provides details about the DCC configuration.
	 *
	 * @var CardPaymentsConfiguration
	 */
	private CardPaymentsConfiguration $dcc_configuration;

	/**
	 * DisabledFundingSources constructor.
	 *
	 * @param Settings                  $settings            The settings.
	 * @param array                     $all_funding_sources All existing funding sources.
	 * @param CardPaymentsConfiguration $dcc_configuration   DCC gateway configuration.
	 */
	public function __construct( Settings $settings, array $all_funding_sources, CardPaymentsConfiguration $dcc_configuration ) {
		$this->settings            = $settings;
		$this->all_funding_sources = $all_funding_sources;
		$this->dcc_configuration   = $dcc_configuration;
	}

	/**
	 * Returns the list of funding sources to be disabled.
	 *
	 * @param string $context The context.
	 * @return string[] List of disabled sources
	 */
	public function sources( string $context ) : array {
		// Free trials have a shorter, special funding-source rule.
		if ( $this->is_free_trial_cart() ) {
			$disable_funding = $this->get_sources_for_free_trial();

			return $this->sanitize_and_filter_sources( $disable_funding );
		}

		$disable_funding  = $this->get_sources_from_settings();
		$is_block_context = in_array( $context, array( 'checkout-block', 'cart-block' ), true );

		// Apply rules based on context and payment methods.
		$disable_funding = $this->apply_context_rules( $disable_funding );

		// Apply special rules for block checkout.
		if ( $is_block_context ) {
			$disable_funding = $this->apply_block_checkout_rules( $disable_funding );
		}

		return $this->sanitize_and_filter_sources( $disable_funding );
	}

	/**
	 * Gets disabled funding sources from settings.
	 *
	 * @return array
	 */
	private function get_sources_from_settings() : array {
		try {
			return $this->settings->get( 'disable_funding' );
		} catch ( NotFoundException $exception ) {
			return array();
		}
	}

	/**
	 * Gets disabled funding sources for free trial carts.
	 *
	 * Rule: Carts that include a free trial product can ONLY use the
	 * funding source "card" - all other sources are disabled.
	 *
	 * @return array
	 */
	private function get_sources_for_free_trial() : array {
		// Disable all sources.
		$disable_funding = array_keys( $this->all_funding_sources );

		if ( is_checkout() && $this->dcc_configuration->is_bcdc_enabled() ) {
			// If BCDC is used, re-enable card payments.
			$disable_funding = array_filter(
				$disable_funding,
				static fn( string $funding_source ) => $funding_source !== 'card'
			);
		}

		return $disable_funding;
	}

	/**
	 * Applies rules based on context and payment methods.
	 *
	 * @param array $disable_funding The current disabled funding sources.
	 * @return array
	 */
	private function apply_context_rules( array $disable_funding ) : array {
		if ( ! is_checkout() || ! $this->dcc_configuration->is_bcdc_enabled() ) {
			// Non-checkout pages, or BCDC disabled: Don't load card payments.
			$disable_funding[] = 'card';

			return $disable_funding;
		}

		// A checkout page and BCDC is enabled: Load card payments.
		return array_filter(
			$disable_funding,
			static fn( string $funding_source ) => $funding_source !== 'card'
		);
	}

	/**
	 * Applies special rules for block checkout.
	 *
	 * @param array $disable_funding The current disabled funding sources.
	 * @return array
	 */
	private function apply_block_checkout_rules( array $disable_funding ) : array {
		/**
		 * Block checkout only supports the following funding methods:
		 * - PayPal
		 * - PayLater
		 * - Venmo
		 * - ACDC ("card", conditionally)
		 */
		$allowed_in_blocks = array( 'venmo', 'paylater', 'paypal', 'card' );

		return array_merge(
			$disable_funding,
			array_diff( array_keys( $this->all_funding_sources ), $allowed_in_blocks )
		);
	}

	/**
	 * Filters the disabled "funding-sources" list and returns a sanitized array.
	 *
	 * @param array $disable_funding The disabled funding sources.
	 * @return string[]
	 */
	private function sanitize_and_filter_sources( array $disable_funding ) : array {
		/**
		 * Filters the final list of disabled funding sources.
		 */
		$disable_funding = apply_filters(
			'woocommerce_paypal_payments_sdk_disabled_funding_hook',
			$disable_funding
		);

		// Make sure "paypal" is never disabled in the funding-sources.
		$disable_funding = array_filter(
			$disable_funding,
			static fn( string $funding_source ) => $funding_source !== 'paypal'
		);

		return array_unique( $disable_funding );
	}
}
