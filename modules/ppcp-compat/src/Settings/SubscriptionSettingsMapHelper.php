<?php
/**
 * A helper for mapping the old/new subscription settings.
 *
 * @package WooCommerce\PayPalCommerce\Compat\Settings
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Compat\Settings;

use WooCommerce\PayPalCommerce\WcSubscriptions\Helper\SubscriptionHelper;

/**
 * A map of old to new styling settings.
 *
 * In new settings UI we have to automatically set Subscriptions mode value based on the type of merchant.
 * So here we will fake the map and later inject the value of the old subscription setting value based on the type of merchant.
 * - Non-vaulting merchants should have it set to PayPal Subscriptions.
 * - Merchants with vaulting should have it set to PayPal Vaulting.
 * - The disabled subscriptions can be retrieved by using a filter.
 *
 * @psalm-import-type newSettingsKey from SettingsMap
 * @psalm-import-type oldSettingsKey from SettingsMap
 */
class SubscriptionSettingsMapHelper {

	public const OLD_SETTINGS_SUBSCRIPTION_MODE_VALUE_VAULTING      = 'vaulting_api';
	public const OLD_SETTINGS_SUBSCRIPTION_MODE_VALUE_SUBSCRIPTIONS = 'subscriptions_api';
	public const OLD_SETTINGS_SUBSCRIPTION_MODE_VALUE_DISABLED      = 'disable_paypal_subscriptions';

	/**
	 * The subscription helper.
	 *
	 * @var SubscriptionHelper $subscription_helper
	 */
	protected SubscriptionHelper $subscription_helper;

	/**
	 * Constructor.
	 *
	 * @param SubscriptionHelper $subscription_helper The subscription helper.
	 */
	public function __construct( SubscriptionHelper $subscription_helper ) {
		$this->subscription_helper = $subscription_helper;
	}

	/**
	 * Maps the old subscription setting key.
	 *
	 * We just need to fake the map here as this setting doesn't exist it new settings.
	 * We will automatically set Subscriptions mode value based on the type of merchant.
	 *
	 * @psalm-return array<oldSettingsKey, newSettingsKey>
	 */
	public function map(): array {
		return array( 'subscriptions_mode' => '' );
	}

	/**
	 * Retrieves the value of a mapped subscriptions_mode key from the new settings.
	 *
	 * @param string                      $old_key The key from the legacy settings.
	 * @param array<string, scalar|array> $settings_model The new settings model data as an array.
	 *
	 * @return 'vaulting_api'|'subscriptions_api'|'disable_paypal_subscriptions'|null The value of the mapped subscriptions_mode setting (null if not found).
	 */
	public function mapped_value( string $old_key, array $settings_model ): ?string {
		if ( $old_key !== 'subscriptions_mode' || ! $this->subscription_helper->plugin_is_active() ) {
			return null;
		}

		$vaulting                = $settings_model['save_paypal_and_venmo'] ?? false;
		$subscription_mode_value = $vaulting ? self::OLD_SETTINGS_SUBSCRIPTION_MODE_VALUE_VAULTING : self::OLD_SETTINGS_SUBSCRIPTION_MODE_VALUE_SUBSCRIPTIONS;

		/**
		 * Allows to disable the subscription mode when using the new settings UI.
		 *
		 * @returns bool true if the subscription mode should be disabled, otherwise false (also by default).
		 */
		$subscription_mode_disabled = (bool) apply_filters( 'woocommerce_paypal_payments_subscription_mode_disabled', false );

		return $subscription_mode_disabled ? self::OLD_SETTINGS_SUBSCRIPTION_MODE_VALUE_DISABLED : $subscription_mode_value;
	}
}
