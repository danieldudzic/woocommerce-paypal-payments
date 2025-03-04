<?php
/**
 * A helper for mapping the old/new payment method settings.
 *
 * @package WooCommerce\PayPalCommerce\Compat\Settings
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Compat\Settings;

use WooCommerce\PayPalCommerce\Settings\Data\PaymentSettings;

/**
 * A map of old to new payment method settings.
 *
 * @psalm-import-type newSettingsKey from SettingsMap
 * @psalm-import-type oldSettingsKey from SettingsMap
 */
class PaymentMethodSettingsMapHelper {

	/**
	 * Maps old setting keys to new payment method settings names.
	 *
	 * @psalm-return array<oldSettingsKey, newSettingsKey>
	 */
	public function map(): array {
		return array(
			'dcc_enabled' => 'acdc',
			'axo_enabled' => 'axo',
		);
	}

	/**
	 * Retrieves the value of a mapped key from the new settings.
	 *
	 * @param string          $old_key The key from the legacy settings.
	 * @param PaymentSettings $payment_settings The payment settings model.
	 *
	 * @return mixed The value of the mapped setting, (null if not found).
	 */
	public function mapped_value( string $old_key, PaymentSettings $payment_settings ): ?bool {

		$payment_method = $this->map()[ $old_key ] ?? false;

		if ( ! $payment_method ) {
			return null;
		}

		return $payment_settings->is_method_enabled( $payment_method );
	}
}
