<?php
declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\CardFields\Service;

use Mockery;
use WooCommerce\PayPalCommerce\ApiClient\Entity\Order;
use WooCommerce\PayPalCommerce\ApiClient\Entity\OrderStatus;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PaymentSource;
use WooCommerce\PayPalCommerce\TestCase;

class CardCaptureValidatorTest extends TestCase {

	public function test_is_valid_when_payment_source_is_not_card() {
		$validator = new CardCaptureValidator();

		$order = Mockery::mock(Order::class);
		$paymentSource = Mockery::mock(PaymentSource::class);

		$order->shouldReceive('payment_source')->andReturn($paymentSource);
		$paymentSource->shouldReceive('name')->andReturn('foo');

		$this->assertTrue($validator->is_valid($order));
	}

	public function test_is_valid_if_order_status_is_approved() {
		$validator = new CardCaptureValidator();

		$order = Mockery::mock(Order::class);
		$paymentSource = Mockery::mock(PaymentSource::class);
		$orderStatus = Mockery::mock(OrderStatus::class);

		$order->shouldReceive('payment_source')->andReturn($paymentSource);
		$paymentSource->shouldReceive('name')->andReturn('card');

		$order->shouldReceive('status')->andReturn($orderStatus);
		$orderStatus->shouldReceive('name')->andReturn($orderStatus::APPROVED);

		$this->assertTrue($validator->is_valid($order));
	}
}
