<?php
/**
 * A helper for mapping the old/new subscription settings.
 *
 * @package WooCommerce\PayPalCommerce\Compat\Settings
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Compat\Settings;

use WooCommerce\PayPalCommerce\Settings\DTO\LocationStylingDTO;
use WooCommerce\PayPalCommerce\WcSubscriptions\Helper\SubscriptionHelper;

/**
 * A map of old to new styling settings.
 *
 * In new settings UI we have to automatically set Subscriptions mode value based on the type of merchant.
 * So here we will fake the map and later inject the value of the old subscription setting value based on the type of merchant.
 * - Non-vaulting merchants should have it set to PayPal Subscriptions
 * - Merchants with vaulting should have it set to PayPal Vaulting
 *
 * @psalm-import-type newSettingsKey from SettingsMap
 * @psalm-import-type oldSettingsKey from SettingsMap
 */
class SubscriptionSettingsMapHelper {

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
	 * Retrieves the value of a mapped key from the new settings.
	 *
	 * @param string               $old_key The key from the legacy settings.
	 * @param LocationStylingDTO[] $styling_models The list of location styling models.
	 *
	 * @return mixed The value of the mapped setting, (null if not found).
	 */
	public function mapped_value( string $old_key, array $styling_models ) {
		if ( $old_key !== 'subscriptions_mode' || ! $this->subscription_helper->plugin_is_active() ) {
			return null;
		}

	}
}
