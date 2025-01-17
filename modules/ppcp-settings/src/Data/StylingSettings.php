<?php
/**
 * Styling details class
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Data;

use WooCommerce\PayPalCommerce\Settings\DTO\LocationStylingDTO;

/**
 * Class StylingSettings
 *
 * Stores and manages the styling details.
 */
class StylingSettings extends AbstractDataModel {

	/**
	 * Option key where profile details are stored.
	 *
	 * @var string
	 */
	protected const OPTION_KEY = 'woocommerce-ppcp-data-styling';

	/**
	 * Get default values for the model.
	 *
	 * @return array
	 */
	protected function get_defaults() : array {
		return array(
			'cart'             => new LocationStylingDTO( 'cart' ),
			'classic_checkout' => new LocationStylingDTO( 'classic_checkout' ),
			'express_checkout' => new LocationStylingDTO( 'express_checkout' ),
			'mini_cart'        => new LocationStylingDTO( 'mini_cart' ),
			'product'          => new LocationStylingDTO( 'product' ),
		);
	}

	/**
	 * Get styling details for Cart and Block Cart.
	 *
	 * @return LocationStylingDTO
	 */
	public function get_cart() : LocationStylingDTO {
		return $this->data['cart'];
	}

	/**
	 * Get styling details for Classic Checkout.
	 *
	 * @return LocationStylingDTO
	 */
	public function get_classic_checkout() : LocationStylingDTO {
		return $this->data['classic_checkout'];
	}

	/**
	 * Get styling details for Express Checkout.
	 *
	 * @return LocationStylingDTO
	 */
	public function get_express_checkout() : LocationStylingDTO {
		return $this->data['express_checkout'];
	}

	/**
	 * Get styling details for Mini Cart
	 *
	 * @return LocationStylingDTO
	 */
	public function get_mini_cart() : LocationStylingDTO {
		return $this->data['mini_cart'];
	}

	/**
	 * Get styling details for Product Page.
	 *
	 * @return LocationStylingDTO
	 */
	public function get_product() : LocationStylingDTO {
		return $this->data['product'];
	}
}
