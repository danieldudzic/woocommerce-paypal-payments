<?php
declare( strict_types=1 );

namespace WooCommerce\PayPalCommerce\Settings;

use WooCommerce\PayPalCommerce\Settings\Service\BrandedExperienceActivationDetector;
use WooCommerce\PayPalCommerce\TestCase;
use function Brain\Monkey\Functions\when;
use function Brain\Monkey\Functions\expect;

class BrandedExperienceActivationDetectorTest extends TestCase {

	public function test_returns_direct_if_not_attached_via_woocommerce_paths() {
		when( 'get_option' )->justReturn( [] );
		$detector = new BrandedExperienceActivationDetector();

		$this->assertEquals( 'direct', $detector->detect_activation_path() );
	}

	public function test_returns_core_profiler_if_attached_via_core_profiler() {
		expect( 'get_option' )
			->with( 'woocommerce_onboarding_profile', array() )
			->andReturn( [
				'business_extensions' => [
					'woocommerce-paypal-payments'
				],
			] );

		$detector = new BrandedExperienceActivationDetector();

		$this->assertEquals( 'core-profiler', $detector->detect_activation_path() );
	}

	public function test_returns_payment_settings_if_attached_via_payments_settings_page() {
		expect( 'get_option' )
			->with( 'woocommerce_payments_nox_profile', array() )
			->andReturn( [
				'extensions' => [
					'attached' => [
						[
							'slug' => 'woocommerce-paypal-payments',
						]
					],
				],
			] );

		$detector = new BrandedExperienceActivationDetector();

		$this->assertEquals( 'payment-settings', $detector->detect_activation_path() );
	}
}
