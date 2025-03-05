<?php
declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\ApiClient\Repository;

use Mockery;
use WooCommerce\PayPalCommerce\TestCase;
use WooCommerce\PayPalCommerce\ApiClient\Helper\DccApplies;
use function Brain\Monkey\Functions\when;

/**
 * @group api
 * @group onboarding
 */
class PartnerReferralsDataTest extends TestCase {
	/**
	 * Expected nonce that should appear in the payload.
	 */
	private const DEFAULT_NONCE = 'a1233wtergfsdt4365tzrshgfbaewa36AGa1233wtergfsdt4365tzrshgfbaewa36AG';

	/**
	 * Sample URL which is used to mock the `admin_url()` response
	 */
	private const ADMIN_URL = 'https://example.com/wp-admin/';

	/**
	 * Ensure the default "products" are derived from the DccApplies response.
	 */
	public function testDefaultValues() {
		$dccApplies = Mockery::mock( DccApplies::class );
		when( 'admin_url' )->justReturn( '' );
		when( 'add_query_arg' )->justReturn( '' );

		// Case 1 - PayPal Complete Payments.

		$dccApplies->expects( 'for_country_currency' )->andReturn( true );
		$testee = new PartnerReferralsData( $dccApplies );
		$result = $testee->data();

		$this->assertEquals( [ 'PPCP' ], $result['products'] );

		// Case 2 - Express Checkout.

		$dccApplies->expects( 'for_country_currency' )->andReturn( false );
		$testee = new PartnerReferralsData( $dccApplies );
		$result = $testee->data();

		$this->assertEquals( [ 'EXPRESS_CHECKOUT' ], $result['products'] );
	}

	/**
	 * Ensure the generated API payload is stable and contains the expected values.
	 */
	public function testDataStructure() {
		$dccApplies = Mockery::mock( DccApplies::class );

		when( 'admin_url' )->alias( function ( $path ) {
			return self::ADMIN_URL . $path;
		} );

		when( 'add_query_arg' )->alias( function ( $args, $url ) {
			return $url;
		} );

		$testee = new PartnerReferralsData( $dccApplies );
		$result = $testee->data( [ 'PPCP' ], 'TOKEN' );
		$dccApplies->shouldNotHaveReceived( 'for_country_currency' );

		$expected = [
			'partner_config_override' => [
				'return_url'             => 'https://example.com/wp-admin/admin.php?page=wc-settings&tab=checkout&section=ppcp-gateway',
				'return_url_description' => 'Return to your shop.',
				'show_add_credit_card'   => true,
			],
			'products'                => [ 'PPCP' ],
			'legal_consents'          => [
				[
					'type'    => 'SHARE_DATA_CONSENT',
					'granted' => true,
				],
			],
			'operations'              => [
				[
					'operation'                  => 'API_INTEGRATION',
					'api_integration_preference' => [
						'rest_api_integration' => [
							'integration_method'  => 'PAYPAL',
							'integration_type'    => 'FIRST_PARTY',
							'first_party_details' => [
								'features'     => [
									'PAYMENT',
									'FUTURE_PAYMENT',
									'REFUND',
									'ADVANCED_TRANSACTIONS_SEARCH',
									'VAULT',
									'TRACKING_SHIPMENT_READWRITE',
								],
								'seller_nonce' => self::DEFAULT_NONCE,
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $result );
	}
}
