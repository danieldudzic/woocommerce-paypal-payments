<?php
declare( strict_types=1 );

namespace PHPUnit\Settings\Service\BrandedExperience;

use WooCommerce\PayPalCommerce\Settings\Service\BrandedExperience\ActivationDetector;
use WooCommerce\PayPalCommerce\TestCase;
use function Brain\Monkey\Functions\expect;
use function Brain\Monkey\Functions\when;

class ActivationDetectorTest extends TestCase {

	public function test_returns_direct_if_not_attached_via_woocommerce_paths() {
		when( 'get_option' )->justReturn( [] );
		$detector = new ActivationDetector();

		$this->assertEquals( ActivationDetector::DIRECT, $detector->detect_activation_path() );
	}

	public function test_returns_core_profiler_if_attached_via_core_profiler() {
		expect( 'get_option' )
			->with( 'woocommerce_onboarding_profile', array() )
			->andReturn( [
				'business_extensions' => [
					'woocommerce-paypal-payments'
				],
			] );

		$detector = new ActivationDetector();

		$this->assertEquals( ActivationDetector::CORE_PROFILER, $detector->detect_activation_path() );
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

		$detector = new ActivationDetector();

		$this->assertEquals( ActivationDetector::PAYMENT_SETTINGS, $detector->detect_activation_path() );
	}
}
