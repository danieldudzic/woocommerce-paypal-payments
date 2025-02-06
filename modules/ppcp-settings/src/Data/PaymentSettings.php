<?php
/**
 * Payment methods settings class
 *
 * @package WooCommerce\PayPalCommerce\Settings\Data
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Data;

/**
 * Class PaymentSettings
 */
class PaymentSettings extends AbstractDataModel {

	/**
	 * Option key where profile details are stored.
	 *
	 * @var string
	 */
	protected const OPTION_KEY = 'woocommerce-ppcp-data-payment';

	/**
	 * Get default values for the model.
	 *
	 * @return array
	 */
	protected function get_defaults(): array {
		return array(
			'paypal_show_logo'           => false,
			'three_d_secure'             => 'no-3d-secure',
			'fastlane_cardholder_name'   => false,
			'fastlane_display_watermark' => false,
			'venmo_enabled'              => false,
			'paylater_enabled'           => false,
		);
	}

	/**
	 * Get PayPal show logo.
	 *
	 * @return bool
	 */
	public function get_paypal_show_logo(): bool {
		return (bool) $this->data['paypal_show_logo'];
	}

	/**
	 * Get 3DSecure.
	 *
	 * @return string
	 */
	public function get_three_d_secure(): string {
		return $this->data['three_d_secure'];
	}

	/**
	 * Get Fastlane cardholder name.
	 *
	 * @return bool
	 */
	public function get_fastlane_cardholder_name(): bool {
		return (bool) $this->data['fastlane_cardholder_name'];
	}

	/**
	 * Get Fastlane display watermark.
	 *
	 * @return bool
	 */
	public function get_fastlane_display_watermark(): bool {
		return (bool) $this->data['fastlane_display_watermark'];
	}

	/**
	 * Get Venmo enabled.
	 *
	 * @return bool
	 */
	public function get_venmo_enabled(): bool {
		return (bool) $this->data['venmo_enabled'];
	}

	/**
	 * Get Pay Later enabled.
	 *
	 * @return bool
	 */
	public function get_paylater_enabled(): bool {
		return (bool) $this->data['paylater_enabled'];
	}

	/**
	 * Set PayPal show logo.
	 *
	 * @param bool $value The value.
	 * @return void
	 */
	public function set_paypal_show_logo( bool $value ): void {
		$this->data['paypal_show_logo'] = $value;
	}

	/**
	 * Set 3DSecure.
	 *
	 * @param string $value The value.
	 * @return void
	 */
	public function set_three_d_secure( string $value ): void {
		$this->data['three_d_secure'] = $value;
	}

	/**
	 * Set Fastlane cardholder name.
	 *
	 * @param bool $value The value.
	 * @return void
	 */
	public function set_fastlane_cardholder_name( bool $value ): void {
		$this->data['fastlane_cardholder_name'] = $value;
	}

	/**
	 * Set Fastlane display watermark.
	 *
	 * @param bool $value The value.
	 * @return void
	 */
	public function set_fastlane_display_watermark( bool $value ): void {
		$this->data['fastlane_display_watermark'] = $value;
	}

	/**
	 * Set Venmo enabled.
	 *
	 * @param bool $value The value.
	 * @return void
	 */
	public function set_venmo_enabled( bool $value ): void {
		$this->data['venmo_enabled'] = $value;
	}

	/**
	 * Set Pay Later enabled.
	 *
	 * @param bool $value The value.
	 * @return void
	 */
	public function set_paylater_enabled( bool $value ): void {
		$this->data['paylater_enabled'] = $value;
	}
}
