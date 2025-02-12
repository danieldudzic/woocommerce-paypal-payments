<?php
/**
 * Provides functionality for general settings-data management.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Service;

use WooCommerce\PayPalCommerce\Settings\Data\AbstractDataModel;

/**
 * Class SettingsDataManager
 *
 * Manages operations related to plugin settings, primarily focusing on reset functionality.
 * This service can be expanded in the future to include other settings management operations.
 */
class SettingsDataManager {

	/**
	 * Stores a list of all AbstractDataModel instances that are managed by
	 * this service.
	 *
	 * @var AbstractDataModel[]
	 */
	private array $models = array();

	/**
	 * Constructor.
	 *
	 * @param array $data_models List of AbstractDataModel instances.
	 */
	public function __construct( array $data_models ) {
		foreach ( $data_models as $data_model ) {
			if ( $data_model instanceof AbstractDataModel ) {
				$this->models[] = $data_model;
			}
		}
	}

	/**
	 * Completely purges all settings from the DB.
	 *
	 * @return void
	 */
	public function reset_all_settings() : void {
		/**
		 * Broadcast the settings-reset event to allow other modules to perform
		 * cleanup tasks, if needed.
		 */
		do_action( 'woocommerce_paypal_payments_reset_settings' );

		foreach ( $this->models as $model ) {
			$model->purge();
		}

		// Clear any caches.
		wp_cache_flush();
	}
}
