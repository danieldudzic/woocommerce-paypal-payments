<?php
declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Tests\Integration\Factories;

use WC_Product_Simple;
use WC_Product_Variable;
use WC_Product_Variation;
use WooCommerce\PayPalCommerce\Tests\Integration\Fixtures\ProductPresets;

class ProductFactory
{
	private array $created_product_ids = [];

	/**
	 * @param string $preset_name
	 * @return \WC_Product
	 * @throws \WC_Data_Exception
	 */
	public function createFromPreset(string $preset_name): \WC_Product
	{
		$presets = ProductPresets::get();

		if (!isset($presets[$preset_name])) {
			throw new \WC_Data_Exception('invalid_preset', "Product preset '{$preset_name}' not found");
		}

		$preset = $presets[$preset_name];

		// Check if product already exists by SKU
		if (isset($preset['sku'])) {
			$existing_product_id = wc_get_product_id_by_sku($preset['sku']);
			if ($existing_product_id) {
				$existing_product = wc_get_product($existing_product_id);
				if ($existing_product) {
					return $existing_product;
				}
			}
		}

		// Check if product already exists by ID
		if (isset($preset['product_id'])) {
			$existing_product = wc_get_product($preset['product_id']);
			if ($existing_product) {
				return $existing_product;
			}
		}

		switch ($preset['type']) {
			case 'variable':
				return $this->createVariableProduct($preset);
			case 'subscription':
				return $this->createSubscriptionProduct($preset);
			case 'simple':
			default:
				return $this->createSimpleProduct($preset);
		}
	}

	/**
	 * @param array $preset
	 * @return WC_Product_Simple
	 */
	private function createSimpleProduct(array $preset): WC_Product_Simple
	{
		$product = new WC_Product_Simple();
		$product_id = wc_get_product_id_by_sku($preset['sku']);
		$product->set_sku($preset['sku']);
		$product->set_id($product_id);
		$product->set_name($preset['name']);
		$product->set_regular_price($preset['price']);
		$product->set_status('publish');
		$product->save();

		$this->created_product_ids[] = $product_id;

		return $product;
	}

	/**
	 * @param array $preset
	 * @return WC_Product_Variation
	 */
	private function createVariableProduct(array $preset): WC_Product_Variation
	{
		// Create parent variable product
		$parent = new WC_Product_Variable();
		$product_id = wc_get_product_id_by_sku($preset['sku']);
		$parent->set_sku($preset['sku']);
		$parent->set_id($product_id);
		$parent->set_name($preset['name']);
		$parent->set_status('publish');
		$parent->save();

		// Create variation
		$variation = new WC_Product_Variation();
		$variation->set_id($preset['variation_id']);
		$variation->set_parent_id($preset['product_id']);
		$variation->set_regular_price($preset['price']);
		$variation->set_attributes(['color' => 'red']);
		$variation->set_status('publish');
		$variation->save();

		$this->created_product_ids[] = $product_id;
		$this->created_product_ids[] = $preset['variation_id'];

		return $variation;
	}

	/**
	 * @param array $preset
	 * @return \WC_Product_Subscription
	 */
	private function createSubscriptionProduct(array $preset): \WC_Product_Subscription
	{
		$product = new \WC_Product_Subscription();
		$product_id = wc_get_product_id_by_sku($preset['sku']);
		$product->set_id($product_id);
		$product->set_name($preset['name']);
		$product->set_regular_price($preset['price']);
		$product->set_price($preset['price']);
		$product->set_sku($preset['sku']);
		$product->set_manage_stock(false);
		$product->set_tax_status('taxable');
		$product->set_downloadable(false);
		$product->set_virtual(false);
		$product->set_stock_status('instock');
		$product->set_weight('1.1');

		// Subscription-specific properties
		$product->set_subscription_period($preset['subscription_period']);
		$product->set_subscription_period_interval($preset['subscription_period_interval']);
		$product->set_subscription_length($preset['subscription_length']);
		$product->set_subscription_trial_period($preset['subscription_trial_period']);
		$product->set_subscription_trial_length($preset['subscription_trial_length']);
		$product->set_subscription_price($preset['subscription_price']);
		$product->set_subscription_sign_up_fee($preset['subscription_sign_up_fee']);

		$product->set_status('publish');
		$product->save();

		$this->created_product_ids[] = $product_id;

		return $product;
	}

	/**
	 * @param string $sku
	 * @return bool
	 */
	public function exists(string $sku): bool
	{
		$existing_product_id = wc_get_product_id_by_sku($sku);
		return (bool) $existing_product_id;
	}

	/**
	 * Delete all created products
	 */
	public function cleanup(): void
	{
		foreach ($this->created_product_ids as $product_id) {
			wp_delete_post($product_id, true);
		}

		$this->created_product_ids = [];
	}
}
