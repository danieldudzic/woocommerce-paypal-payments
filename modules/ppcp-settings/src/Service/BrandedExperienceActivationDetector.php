<?php
/**
 * Branded Experience activation detector service.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Service;

/**
 * Class that includes detection logic for Branded Experience.
 */
class BrandedExperienceActivationDetector {
	/**
	 * Detects from where the plugin was installed.
	 *
	 * @return string The installation path.
	 */
	public function detect_activation_path(): string {
		$slug = 'woocommerce-paypal-payments';

		$onboarding_data = (array) get_option( 'woocommerce_onboarding_profile', array() );
		if ( ! empty( $onboarding_data['business_extensions'] ) &&
		     is_array( $onboarding_data['business_extensions'] ) &&
		     in_array( $slug, $onboarding_data['business_extensions'], true )
		) {
			return 'core-profiler';
		}

		$nox_data = (array) get_option( 'woocommerce_payments_nox_profile', array() );
		if ( ! empty( $nox_data['extensions']['attached'] ) &&
		     is_array( $nox_data['extensions']['attached'] ) &&
		     in_array( $slug, array_column( $nox_data['extensions']['attached'], 'slug' ), true )
		) {
			return 'payment-settings';
		}

		return 'direct';
	}
}
