<?php
/**
 * A helper for mapping the old/new settings tab settings.
 *
 * @package WooCommerce\PayPalCommerce\Compat\Settings
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Compat\Settings;

use WooCommerce\PayPalCommerce\ApiClient\Helper\PurchaseUnitSanitizer;
use WooCommerce\PayPalCommerce\Button\Helper\ContextTrait;

/**
 * A map of old to new styling settings.
 *
 * @psalm-import-type newSettingsKey from SettingsMap
 * @psalm-import-type oldSettingsKey from SettingsMap
 */
class SettingsTabMapHelper {

	use ContextTrait;

	/**
	 * Maps old setting keys to new setting keys.
	 *
	 * @psalm-return array<oldSettingsKey, newSettingsKey>
	 */
	public function map(): array {
		return array(
			'disable_cards'              => 'disabled_cards',
			'brand_name'                 => 'brand_name',
			'soft_descriptor'            => 'soft_descriptor',
			'subtotal_mismatch_behavior' => 'subtotal_adjustment',
		);
	}

	/**
	 * Retrieves the value of a mapped key from the new settings.
	 *
	 * @param string $old_key The key from the legacy settings.
	 * @param array<string, scalar|array> $settings_model The new settings model data as an array.
	 * @return mixed The value of the mapped setting, (null if not found).
	 */
	public function mapped_value( string $old_key, array $settings_model ) {
		$settings_map = $this->map();
		$new_key      = $settings_map[ $old_key ] ?? false;
		switch ( $old_key ) {
			case 'subtotal_mismatch_behavior':
				return $this->mapped_mismatch_behavior_value( $settings_model );

			default:
				return $settings_model[ $new_key ] ?? null;
		}
	}

	/**
	 * Retrieves the mapped mismatch_behavior value from the new settings.
	 *
	 * @param array<string, scalar|array> $settings_model The new settings model data as an array.
	 * @return 'extra_line'|'ditch'|null The mapped mismatch_behavior value.
	 */
	protected function mapped_mismatch_behavior_value( array $settings_model ): ?string {
		$subtotal_adjustment = $settings_model[ 'subtotal_adjustment' ] ?? false;

		if ( ! $subtotal_adjustment ) {
			return null;
		}

		return $subtotal_adjustment === 'correction' ? PurchaseUnitSanitizer::MODE_EXTRA_LINE : PurchaseUnitSanitizer::MODE_DITCH;
	}
}
