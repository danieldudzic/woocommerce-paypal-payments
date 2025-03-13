<?php

namespace WooCommerce\PayPalCommerce\Tests\Integration;

use WC_Product_Simple;
use WooCommerce\PayPalCommerce\PayPalSubscriptions\RenewalHandler;

class PayPalSubscriptionsRenewalTest extends TestCase {
	public function test_renewal_order_is_not_created_just_after_receiving_webhook() {
		$c       = $this->getContainer();
		$handler = new RenewalHandler( $c->get( 'woocommerce.logger.woocommerce' ) );

		// Simulates receiving webhook 1 minute after subscription start.
		$subscription = $this->createSubscription( '-1 minute' );

		$handler->process( [ $subscription ], 'TRANSACTION-ID' );
		$renewal = $subscription->get_related_orders( 'ids', array( 'renewal' ) );
		$this->assertEquals( count( $renewal ), 0 );
	}

	public function test_renewal_order_is_created_when_receiving_webhook_nine_hours_later() {
		$c       = $this->getContainer();
		$handler = new RenewalHandler( $c->get( 'woocommerce.logger.woocommerce' ) );

		// Simulates receiving webhook 9 hours after subscription start.
		$subscription = $this->createSubscription( '-9 hour' );

		$handler->process( [ $subscription ], 'TRANSACTION-ID' );
		$renewal = $subscription->get_related_orders( 'ids', array( 'renewal' ) );
		$this->assertEquals( count( $renewal ), 1 );
	}

	private function createSubscription( string $startDate ) {
		$order = wc_create_order( [
			'customer_id'    => 1,
			'set_paid'       => true,
			'payment_method' => 'ppcp-gateway',
			'billing'        => [
				'first_name' => 'John',
				'last_name'  => 'Doe',
				'address_1'  => '969 Market',
				'address_2'  => '',
				'city'       => 'San Francisco',
				'state'      => 'CA',
				'postcode'   => '94103',
				'country'    => 'US',
				'email'      => 'john.doe@example.com',
				'phone'      => '(555) 555-5555'
			],
			'line_items'     => [
				[
					'product_id' => 42,
					'quantity'   => 1
				]
			],
		] );

		$product = new WC_Product_Simple();
		$product->set_props([
			'name'          => 'Dummy Product',
			'regular_price' => 10,
			'price'         => 10,
			'sku'           => 'DUMMY SKU',
			'manage_stock'  => false,
			'tax_status'    => 'taxable',
			'downloadable'  => false,
			'virtual'       => false,
			'stock_status'  => 'instock',
			'weight'        => '1.1',
		]);

		return wcs_create_subscription([
			'start_date' => gmdate( 'Y-m-d H:i:s', strtotime($startDate) ),
			'parent_id' => $order->get_id(),
			'customer_id' => 1,
			'status' => 'active',
			'billing_period' => 'day',
			'billing_interval' => 1,
			'payment_method' => 'ppcp-gateway',
			'line_items' => [
				[
					'product_id' => $product->get_id(),
					'quantity' => 1
				]
			],
		]);
	}
}
