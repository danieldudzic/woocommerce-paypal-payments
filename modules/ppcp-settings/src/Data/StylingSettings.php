<?php
/**
 * Styling details class
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Data;

/**
 * Class StylingSettings
 *
 * Stores and manages the styling details.
 */
class StylingSettings extends AbstractDataModel {

	/**
	 * Option key where profile details are stored.
	 *
	 * @var string
	 */
	protected const OPTION_KEY = 'woocommerce-ppcp-data-styling';

	/**
	 * Get default values for the model.
	 *
	 * @return array
	 */
	protected function get_defaults() : array {
		return array(
			'shape' => 'rect',
		);
	}
}
