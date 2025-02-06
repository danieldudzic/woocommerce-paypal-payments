<?php
/**
 * A helper for mapping the old/new styling settings.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Compat
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Settings\Compat;

use WooCommerce\PayPalCommerce\Settings\Data\StylingSettings;

/**
 * A map of old to new styling settings.
 *
 * @psalm-import-type newSettingsKey from SettingsMap
 * @psalm-import-type oldSettingsKey from SettingsMap
 */
class StylingSettingsMapHelper {

	/**
	 * The constructor.
	 *
	 * @param StylingSettings $model The styling settings model.
	 */
	public function __construct( StylingSettings $model ) {
		$this->model = $model;
	}

	/**
	 * Maps old setting keys to new setting style names.
	 *
	 * The `StylingSettings` class stores settings as `LocationStylingDTO` objects.
	 * This method creates a mapping from old setting keys to the corresponding style names.
	 *
	 * Example:
	 * 'button_product_layout' => 'layout'
	 *
	 * This mapping will allow to retrieve the correct style value
	 * from a `LocationStylingDTO` object by dynamically accessing its properties.
	 *
	 * @psalm-return array<oldSettingsKey, newSettingsKey>
	 */
	public function map(): array {

		$mapped_settings = array();

		foreach ( $this->locations_map() as $old_location_name => $new_location_name ) {
			foreach ( $this->styles() as $style ) {
				$old_styling_key                     = $this->get_old_styling_setting_key( $old_location_name, $style );
				$mapped_settings[ $old_styling_key ] = $style;
			}
		}

		return $mapped_settings;
	}

	/**
	 * Retrieves the value of a mapped key from the new settings.
	 *
	 * @param string $old_key The key from the legacy settings.
	 *
	 * @return mixed|null The value of the mapped setting, or null if not found.
	 */
	public function mapped_value( string $old_key ) {
		foreach ( $this->locations_map() as $old_location_name => $new_location_name ) {
			foreach ( $this->styles() as $style ) {
				if ( $old_key !== $this->get_old_styling_setting_key( $old_location_name, $style ) ) {
					continue;
				}

				$method = "get_{$new_location_name}";

				if ( ! method_exists( $this->model, $method ) ) {
					return null;
				}

				$location_settings = $this->model->$method();

				return $location_settings->$style ?? null;
			}
		}

		return null;
	}

	/**
	 * Returns a mapping of old button location names to new settings location names.
	 *
	 * @return string[] The mapping of old location names to new location names.
	 */
	protected function locations_map(): array {
		return array(
			'product'                => 'product',
			'cart'                   => 'cart',
			'checkout'               => 'classic_checkout',
			'mini-cart'              => 'mini_cart',
			'checkout-block-express' => 'express_checkout',
		);
	}

	/**
	 * Returns the available style names.
	 *
	 * @return string[] The list of available style names.
	 */
	protected function styles(): array {
		return array(
			'enabled',
			'methods',
			'shape',
			'label',
			'color',
			'layout',
			'tagline',
		);
	}

	/**
	 * Returns the old styling setting key name based on provided location and style names.
	 *
	 * @param string $location The location name.
	 * @param string $style    The style name.
	 * @return string The old styling setting key name.
	 */
	protected function get_old_styling_setting_key( string $location, string $style ): string {
		$location_setting_name_part = $location === 'checkout' ? '' : "_{$location}";
		return "button{$location_setting_name_part}_{$style}";
	}
}
