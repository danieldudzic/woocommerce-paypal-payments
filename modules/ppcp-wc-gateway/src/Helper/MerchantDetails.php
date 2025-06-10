<?php
/**
 * Provides a central information source for details about the current PayPal merchant.
 *
 * @package WooCommerce\PayPalCommerce\WcGateway\Helper
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\WcGateway\Helper;

/**
 * Main information source about merchant details.
 */
class MerchantDetails {
	/**
	 * The merchant's country according to PayPal, which might be different from
	 * the WooCommerce country.
	 *
	 * #legacy-ui uses the Woo store country for this.
	 *
	 * @var string
	 */
	private string $merchant_country;

	/**
	 * The WooCommerce store country.
	 *
	 * @var string
	 */
	private string $store_country;

	/**
	 * Constructor.
	 *
	 * @param string $merchant_country Initial merchant country.
	 * @param string $store_country    Initial store country.
	 */
	public function __construct( string $merchant_country, string $store_country ) {
		$this->merchant_country = $merchant_country;
		$this->store_country    = $store_country;
	}

	/**
	 * Returns the merchant's country. This country is used by PayPal to decide
	 * which features the merchant can access.
	 *
	 * This country is provided by PayPal and defines the operating country of
	 * the merchant.
	 *
	 * @return string
	 */
	public function get_merchant_country() : string {
		return $this->merchant_country;
	}

	/**
	 * The WooCommerce store's country, which could be different from the
	 * merchant's country in some cases. This country is used by WooCommerce.
	 *
	 * @return string
	 */
	public function get_shop_country() : string {
		return $this->store_country;
	}
}
