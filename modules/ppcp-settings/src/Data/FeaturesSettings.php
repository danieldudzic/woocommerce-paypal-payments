<?php
/**
 * Todos details class
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Settings\Data;

/**
 * Class TodosModel
 *
 * Handles todos data persistence and state management.
 */
class FeaturesSettings extends AbstractDataModel {

	/**
	 * Option key for WordPress storage.
	 */
	protected const OPTION_KEY = 'woocommerce-ppcp-data-features';

	/**
	 * Returns the default structure for settings data.
	 *
	 * @return array
	 */
	protected function get_defaults(): array {
		return array(
			'features'        => array(),
		);
	}

	/**
	 * Gets the features.
	 *
	 * @return array
	 */
	public function get_features(): array {
		return $this->data['features'] ?? array();
	}
}
