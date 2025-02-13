<?php
/**
 * Provides functionality for general settings-data management.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Service;

use WooCommerce\PayPalCommerce\Settings\Data\AbstractDataModel;
use WooCommerce\PayPalCommerce\Settings\Data\OnboardingProfile;
use WooCommerce\PayPalCommerce\Settings\DTO\ConfigurationFlagsDTO;

/**
 * Class SettingsDataManager
 *
 * Manages operations related to plugin settings, primarily focusing on reset functionality.
 * This service can be expanded in the future to include other settings management operations.
 */
class SettingsDataManager {

	/**
	 * The onboarding profile data model.
	 *
	 * @var OnboardingProfile
	 */
	private OnboardingProfile $onboarding_profile;

	/**
	 * Stores a list of all AbstractDataModel instances that are managed by
	 * this service.
	 *
	 * @var AbstractDataModel[]
	 */
	private array $purgeable_models = array();

	/**
	 * Constructor.
	 *
	 * @param OnboardingProfile $onboarding_profile The onboarding profile model.
	 * @param array             ...$data_models     List of additional data models to reset.
	 */
	public function __construct( OnboardingProfile $onboarding_profile, ...$data_models ) {
		foreach ( $data_models as $data_model ) {
			if ( $data_model instanceof AbstractDataModel ) {
				$this->purgeable_models[] = $data_model;
			}
		}

		$this->purgeable_models[] = $onboarding_profile;
		$this->onboarding_profile = $onboarding_profile;
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

		foreach ( $this->purgeable_models as $model ) {
			$model->purge();
		}

		// Clear any caches.
		wp_cache_flush();
	}

	/**
	 * Applies a default configuration to the plugin for a new merchant.
	 *
	 * This method checks the onboarding "setup_done" flag to determine if
	 * the defaults should be applied. At the end of this method, the
	 * "setup_done" flag is set, so future calls to the method have no effect.
	 *
	 * @param ConfigurationFlagsDTO $flags The configuration flags.
	 * @return void
	 */
	public function set_defaults_for_new_merchant( ConfigurationFlagsDTO $flags ) : void {
		if ( $this->onboarding_profile->is_setup_done() ) {
			return;
		}

		$this->apply_configuration( $flags );

		$this->onboarding_profile->set_setup_done( true );
		$this->onboarding_profile->save();
	}

	/**
	 * Applies a default configuration to the plugin, without any condition.
	 *
	 * @param ConfigurationFlagsDTO $flags The configuration flags.
	 * @return void
	 */
	protected function apply_configuration( ConfigurationFlagsDTO $flags ) : void {
		// Apply defaults for the "Payment Methods" tab.

		// Apply defaults for the "Settings" tab.

		// Assign defaults for the "Styling" tab.
	}
}
