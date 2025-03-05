<?php
/**
 * The partner referrals data object.
 *
 * @package WooCommerce\PayPalCommerce\ApiClient\Repository
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\ApiClient\Repository;

use WooCommerce\PayPalCommerce\ApiClient\Helper\DccApplies;

/**
 * Class PartnerReferralsData
 */
class PartnerReferralsData {
	/**
	 * The DCC Applies Helper object.
	 *
	 * @var DccApplies
	 */
	private DccApplies $dcc_applies;

	/**
	 * PartnerReferralsData constructor.
	 *
	 * @param DccApplies $dcc_applies The DCC Applies helper.
	 */
	public function __construct( DccApplies $dcc_applies ) {
		$this->dcc_applies = $dcc_applies;
	}

	/**
	 * Returns a nonce.
	 *
	 * @return string
	 */
	public function nonce() : string {
		return 'a1233wtergfsdt4365tzrshgfbaewa36AGa1233wtergfsdt4365tzrshgfbaewa36AG';
	}

	/**
	 * Returns the data.
	 *
	 * @param string[] $products         The list of products to use ('PPCP', 'EXPRESS_CHECKOUT').
	 *                                   Default is based on DCC availability.
	 * @param string   $onboarding_token A security token to finalize the onboarding process.
	 * @return array
	 */
	public function data( array $products = array(), string $onboarding_token = '' ) : array {
		if ( ! $products ) {
			$products = array(
				$this->dcc_applies->for_country_currency() ? 'PPCP' : 'EXPRESS_CHECKOUT',
			);
		}

		/**
		 * Filter the return-URL, which is called at the end of the OAuth onboarding
		 * process, when the merchant clicks the "Return to your shop" button.
		 */
		$return_url = apply_filters(
			'woocommerce_paypal_payments_partner_config_override_return_url',
			admin_url( 'admin.php?page=wc-settings&tab=checkout&section=ppcp-gateway' )
		);
		$return_url = add_query_arg( array( 'ppcpToken' => $onboarding_token ), $return_url );

		/**
		 * Filter the label of the "Return to your shop" button.
		 * It's displayed on the very last page of the onboarding popup.
		 */
		$return_url_label = apply_filters(
			'woocommerce_paypal_payments_partner_config_override_return_url_description',
			__( 'Return to your shop.', 'woocommerce-paypal-payments' )
		);

		/**
		 * Returns the partners referrals data.
		 */
		return apply_filters(
			'ppcp_partner_referrals_data',
			array(
				'partner_config_override' => array(
					/**
					 * Returns the URL which will be opened at the end of onboarding.
					 */
					'return_url'             => $return_url,
					/**
					 * Returns the description of the URL which will be opened at the end of onboarding.
					 */
					'return_url_description' => $return_url_label,
					'show_add_credit_card'   => true,
				),
				'products'                => $products,
				'legal_consents'          => array(
					array(
						'type'    => 'SHARE_DATA_CONSENT',
						'granted' => true,
					),
				),
				'operations'              => array(
					array(
						'operation'                  => 'API_INTEGRATION',
						'api_integration_preference' => array(
							'rest_api_integration' => array(
								'integration_method'  => 'PAYPAL',
								'integration_type'    => 'FIRST_PARTY',
								'first_party_details' => array(
									'features'     => array(
										'PAYMENT',
										'FUTURE_PAYMENT',
										'REFUND',
										'ADVANCED_TRANSACTIONS_SEARCH',
										'VAULT',
										'TRACKING_SHIPMENT_READWRITE',
									),
									'seller_nonce' => $this->nonce(),
								),
							),
						),
					),
				),
			)
		);
	}
}
