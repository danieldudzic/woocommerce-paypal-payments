<?php
/**
 * Creates the list of disabled funding sources.
 *
 * @package WooCommerce\PayPalCommerce\Button\Helper
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Button\Helper;

use WooCommerce\PayPalCommerce\WcGateway\Exception\NotFoundException;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\CardButtonGateway;
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

		$disable_funding = $this->get_sources_from_settings();
		$payment_flags   = $this->get_payment_method_flags();
		$context_flags   = $this->get_context_flags( $context );

		// Apply rules based on context and payment methods.
		$disable_funding = $this->apply_context_rules(
			$disable_funding,
			$context_flags,
			$payment_flags
		);

		// Apply special rules for block checkout.
		if ( $context_flags['is_block_context'] ) {
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
			return $this->settings->has( 'disable_funding' )
				? $this->settings->get( 'disable_funding' )
				: array();
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
		$disable_funding = array_keys( $this->all_funding_sources );
		$payment_flags   = $this->get_payment_method_flags();

		if ( $payment_flags['is_using_cards'] ) {
			$disable_funding = array_filter(
				$disable_funding,
				static fn( string $funding_source ) => $funding_source !== 'card'
			);
		}

		return $disable_funding;
	}

	/**
	 * Gets context flags based on the current page and context.
	 *
	 * @param string $context The context.
	 * @return array
	 */
	private function get_context_flags( string $context ) : array {
		$is_checkout_page    = is_checkout();
		$is_block_context    = in_array( $context, array( 'checkout-block', 'cart-block' ), true );
		$is_classic_checkout = $is_checkout_page && ! $is_block_context;

		return array(
			'is_checkout_page'    => $is_checkout_page,
			'is_block_context'    => $is_block_context,
			'is_classic_checkout' => $is_classic_checkout,
		);
	}

	/**
	 * Gets payment method availability flags.
	 *
	 * @return array
	 */
	private function get_payment_method_flags() : array {
		$is_dcc_enabled     = $this->dcc_configuration->is_enabled();
		$available_gateways = WC()->payment_gateways->get_available_payment_gateways();

		// TODO: This check does not make much sense in the new UI. The gateway is always available when the "dcc_enabled" flag is true.
		// Review and adjust when removing #legacy-ui code.
		$is_card_gateway_enabled = isset( $available_gateways[ CardButtonGateway::ID ] );

		return array(
			// Whether the new Advanced Card Processing gateway is active.
			'is_dcc_enabled' => $is_dcc_enabled,

			// Whether card payments are generally used (DCC or BCDC).
			'is_using_cards' => $is_dcc_enabled || $is_card_gateway_enabled,
		);
	}

	/**
	 * Applies rules based on context and payment methods.
	 *
	 * @param array $disable_funding The current disabled funding sources.
	 * @param array $context_flags   Context flags.
	 * @param array $payment_flags   Payment method flags.
	 * @return array
	 */
	private function apply_context_rules( array $disable_funding, array $context_flags, array $payment_flags ) : array {
		if ( $context_flags['is_block_context'] && $payment_flags['is_dcc_enabled'] ) {
			// Rule 1: Block checkout with DCC - do not load card payments.
			$disable_funding[] = 'card';
		} elseif ( ! $context_flags['is_checkout_page'] ) {
			// Rule 2: Non-checkout pages - do not load card payments.
			$disable_funding[] = 'card';
		} elseif ( $context_flags['is_classic_checkout'] && $payment_flags['is_using_cards'] ) {
			// Rule 3: Standard checkout with card methods - load card payments.
			$disable_funding = array_filter(
				$disable_funding,
				static fn( string $funding_source ) => $funding_source !== 'card'
			);
		}

		return $disable_funding;
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
			'woocommerce_paypal_payments_disabled_funding_sources',
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
