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
	 * DisabledFundingSources constructor.
	 *
	 * @param Settings $settings            The settings.
	 * @param array    $all_funding_sources All existing funding sources.
	 */
	public function __construct( Settings $settings, array $all_funding_sources ) {
		$this->settings            = $settings;
		$this->all_funding_sources = $all_funding_sources;
	}

	/**
	 * Returns the list of funding sources to be disabled.
	 *
	 * @param string $context The context.
	 * @return array|int[]|mixed|string[]
	 * @throws NotFoundException When the setting is not found.
	 */
	public function sources( string $context ) {
		$disable_funding = $this->settings->has( 'disable_funding' )
			? $this->settings->get( 'disable_funding' )
			: array();

		// Determine context flags.
		$is_checkout_page    = is_checkout();
		$is_block_context    = in_array( $context, array( 'checkout-block', 'cart-block' ), true );
		$is_classic_checkout = $is_checkout_page && ! $is_block_context;

		// Determine payment method availability flags.
		$is_dcc_enabled          = $this->settings->has( 'dcc_enabled' ) && $this->settings->get( 'dcc_enabled' );
		$available_gateways      = WC()->payment_gateways->get_available_payment_gateways();
		$is_card_gateway_enabled = isset( $available_gateways[ CardButtonGateway::ID ] );
		$is_using_cards          = $is_dcc_enabled || $is_card_gateway_enabled;

		if ( $is_block_context && $is_dcc_enabled ) {
			// Rule 1: Block checkout with DCC - do not load ACDC.
			if ( ! in_array( 'card', $disable_funding, true ) ) {
				$disable_funding[] = 'card';
			}
		} elseif ( ! $is_checkout_page ) {
			// Rule 2: Non-checkout pages - do not load ACDC.
			if ( ! in_array( 'card', $disable_funding, true ) ) {
				$disable_funding[] = 'card';
			}
		} elseif ( $is_classic_checkout && $is_using_cards ) {
			// Rule 3: Standard checkout with card methods - load ACDC.
			$disable_funding = array_filter(
				$disable_funding,
				static fn( string $funding_source ) => $funding_source !== 'card'
			);
		}

		/**
		 * Block checkout only supports the following funding methods:
		 * - PayPal
		 * - PayLater
		 * - Venmo
		 * - ACDC ("card", conditionally)
		 */
		if ( $is_block_context ) {
			$allowed_in_blocks = array( 'venmo', 'paylater', 'paypal', 'card' );

			$disable_funding = array_merge(
				$disable_funding,
				array_diff( array_keys( $this->all_funding_sources ), $allowed_in_blocks )
			);
		}

		/**
		 * Free trials only support the funding method ACDC ("card").
		 */
		if ( $this->is_free_trial_cart() ) {
			$disable_funding = array_keys( $this->all_funding_sources );

			if ( $is_using_cards ) {
				$disable_funding = array_filter(
					$disable_funding,
					static fn( string $funding_source ) => $funding_source !== 'card'
				);
			}
		}

		$disable_funding = apply_filters(
			'woocommerce_paypal_payments_disabled_funding_sources',
			$disable_funding
		);

		// Make sure "paypal" is never disabled in the funding-sources.
		return array_filter(
			$disable_funding,
			static fn( string $funding_source ) => $funding_source !== 'paypal'
		);
	}
}
