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

	private $testee;
	private $dccApplies;

	public function setUp() : void {
		parent::setUp();

		$this->dccApplies = Mockery::mock( DccApplies::class );
		$this->testee     = new PartnerReferralsData( $this->dccApplies );

		when( 'admin_url' )->alias( static fn( string $path ) => self::ADMIN_URL . $path );
		when( 'add_query_arg' )->alias( static fn( $args, $url ) => $url );
	}

	/**
	 * Base structure of the API payload. Each test should modify the returned
	 * value of the method to meet its expectations.
	 *
	 * This avoids repeating the full structure, while also highlighting the
	 * specific changes that different params will generate.
	 *
	 * @return array
	 */
	private function getBaseExpectedArray() : array {
		return [
			'partner_config_override' => [
				'return_url'             => 'https://example.com/wp-admin/admin.php?page=wc-settings&tab=checkout&section=ppcp-gateway',
				'return_url_description' => 'Return to your shop.',
				'show_add_credit_card'   => true,
			],
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
									'REFUND',
									'ADVANCED_TRANSACTIONS_SEARCH',
									'TRACKING_SHIPMENT_READWRITE',
								],
								'seller_nonce' => self::DEFAULT_NONCE,
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Ensure the default "products" are derived from the DccApplies response.
	 */
	public function testDefaultValues() : void {
		/**
		 * Case 1: The data() method gets no parameters, and the DccApplies check
		 * returns TRUE. Onboarding payload should indicate "PPCP".
		 */
		$this->dccApplies->expects( 'for_country_currency' )->andReturn( true );
		$result = $this->testee->data();
		$this->assertEquals( [ 'PPCP' ], $result['products'] );

		/**
		 * Case 2: The data() method gets no parameters, and the DccApplies check
		 * returns FALSE. Onboarding payload should indicate "EXPRESS_CHECKOUT".
		 */
		$this->dccApplies->expects( 'for_country_currency' )->andReturn( false );
		$result = $this->testee->data();
		$this->assertEquals( [ 'EXPRESS_CHECKOUT' ], $result['products'] );
	}

	/**
	 * Ensure the generated API payload is stable and contains the expected values.
	 *
	 * The test only verifies the "products" and "token" arguments, as those are the
	 * core params present in the legacy and new UI.
	 */
	public function testDataStructure() : void {
		/**
		 * Undefined subscription: Keep vaulting in first-party, but don't add the capability.
		 */
		$result = $this->testee->data( [ 'PPCP' ], 'TOKEN' );
		$this->dccApplies->shouldNotHaveReceived( 'for_country_currency' );

		$expected = $this->getBaseExpectedArray();

		$expected['products']     = [ 'PPCP' ];
		$expected['capabilities'] = [];

		$expected['operations'][0]['api_integration_preference']['rest_api_integration']['first_party_details']['features'][] = 'FUTURE_PAYMENT';
		$expected['operations'][0]['api_integration_preference']['rest_api_integration']['first_party_details']['features'][] = 'VAULT';

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Verify new onboarding-flags that are used by the new UI.
	 */
	public function testDataStructureWithFlags() : void {
		/**
		 * With subscriptions: Request full vaulting features.
		 */
		$result   = $this->testee->data( [ 'PPCP' ], 'TOKEN', true );
		$expected = $this->getBaseExpectedArray();

		$expected['products']     = [ 'PPCP' ];
		$expected['capabilities'] = [ 'PAYPAL_WALLET_VAULTING_ADVANCED' ];

		$expected['operations'][0]['api_integration_preference']['rest_api_integration']['first_party_details']['features'][] = 'FUTURE_PAYMENT';
		$expected['operations'][0]['api_integration_preference']['rest_api_integration']['first_party_details']['features'][] = 'VAULT';

		$this->assertEquals( $expected, $result );

		/**
		 * No subscriptions: Also means no vaulting!
		 */
		$result   = $this->testee->data( [ 'PPCP' ], 'TOKEN', false );
		$expected = $this->getBaseExpectedArray();

		$expected['products']     = [ 'PPCP' ];
		$expected['capabilities'] = [];

		$this->assertEquals( $expected, $result );

		// Double-check that the features are not present.
		$this->assertNotContains( 'FUTURE_PAYMENT', $expected['operations'][0]['api_integration_preference']['rest_api_integration']['first_party_details']['features'] );
		$this->assertNotContains( 'VAULT', $expected['operations'][0]['api_integration_preference']['rest_api_integration']['first_party_details']['features'] );
	}
}
