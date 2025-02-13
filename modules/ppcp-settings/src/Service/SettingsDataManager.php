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
use WooCommerce\PayPalCommerce\Settings\DTO\LocationStylingDTO;
use WooCommerce\PayPalCommerce\Googlepay\GooglePayGateway;
use WooCommerce\PayPalCommerce\Applepay\ApplePayGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayPalGateway;
use WooCommerce\PayPalCommerce\Settings\Data\StylingSettings;
use WooCommerce\PayPalCommerce\Settings\Data\GeneralSettings;
use WooCommerce\PayPalCommerce\Settings\Data\SettingsModel;

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
	 * Data model that handles button styling on the front end.
	 *
	 * @var StylingSettings
	 */
	private StylingSettings $styling_settings;

	/**
	 * Stores a list of all AbstractDataModel instances that are managed by
	 * this service.
	 *
	 * @var AbstractDataModel[]
	 */
	private array $models_to_reset = array();

	/**
	 * Constructor.
	 *
	 * @param OnboardingProfile $onboarding_profile The onboarding profile model.
	 * @param GeneralSettings   $general_settings   The general settings model.
	 * @param SettingsModel     $settings_model     The settings model.
	 * @param StylingSettings   $styling_settings   The styling settings model.
	 * @param array             ...$data_models     List of additional data models to reset.
	 */
	public function __construct(
		OnboardingProfile $onboarding_profile,
		GeneralSettings $general_settings,
		SettingsModel $settings_model,
		StylingSettings $styling_settings,
		...$data_models
	) {
		foreach ( $data_models as $data_model ) {
			/**
			 * An instance extracted from the spread operator. We only process
			 * AbstractDataModel instances.
			 *
			 * @var mixed|AbstractDataModel $data_model
			 */

			if ( $data_model instanceof AbstractDataModel ) {
				$this->models_to_reset[] = $data_model;
			}
		}

		$this->models_to_reset[] = $onboarding_profile;
		$this->models_to_reset[] = $general_settings;
		$this->models_to_reset[] = $settings_model;
		$this->models_to_reset[] = $styling_settings;

		$this->onboarding_profile = $onboarding_profile;
		$this->styling_settings   = $styling_settings;
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

		foreach ( $this->models_to_reset as $model ) {
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
		$location_styles = $this->get_location_styles( $flags );
		$this->styling_settings->from_array( $location_styles );
		$this->styling_settings->save();
	}

	/**
	 * Builds an array of styling details that should be applied for the shop.
	 *
	 * @param ConfigurationFlagsDTO $flags Shop configuration flags.
	 * @return LocationStylingDTO[] A set of styling details.
	 */
	protected function get_location_styles( ConfigurationFlagsDTO $flags ) : array {
		$methods_full = array(
			PayPalGateway::ID,
			'venmo',
			'pay-later',
			ApplePayGateway::ID,
			GooglePayGateway::ID,
		);

		$methods_own = array(
			PayPalGateway::ID,
			'venmo',
			'pay-later',
		);

		return array(
			// Cart: Enabled, display PayPal, Venmo, Pay Later, Google Pay, Apple Pay.
			'cart'             => new LocationStylingDTO( 'cart', true, $methods_full ),

			// Classic Checkout: Display PayPal, Venmo, Pay Later, Google Pay, Apple Pay.
			'classic_checkout' => new LocationStylingDTO( 'classic_checkout', true, $methods_full ),

			// Express Checkout: Display PayPal, Venmo, Pay Later, Google Pay, Apple Pay.
			'express_checkout' => new LocationStylingDTO( 'express_checkout', true, $methods_full ),

			// Mini Cart: Display PayPal, Venmo, Pay Later, Google Pay, Apple Pay.
			'mini_cart'        => new LocationStylingDTO( 'mini_cart', true, $methods_full ),

			// Product Page: Display PayPal, Venmo, Pay Later.
			'product'          => new LocationStylingDTO( 'product', true, $methods_own ),
		);
	}
}
