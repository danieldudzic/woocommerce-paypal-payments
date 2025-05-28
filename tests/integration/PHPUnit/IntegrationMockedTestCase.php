<?php
declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Tests\Integration;

use WC_Order;
use WC_Order_Item_Product;
use WC_Payment_Token_CC;
use WC_Subscription;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\OrderEndpoint;
use WooCommerce\PayPalCommerce\ApiClient\Entity\Capture;
use WooCommerce\PayPalCommerce\ApiClient\Entity\CaptureStatus;
use WooCommerce\PayPalCommerce\ApiClient\Entity\Order;
use WooCommerce\PayPalCommerce\ApiClient\Entity\OrderStatus;
use WooCommerce\PayPalCommerce\ApiClient\Entity\Payments;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PaymentSource;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PurchaseUnit;
use WooCommerce\PayPalCommerce\Helper\RedirectorStub;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use WooCommerce\PayPalCommerce\PPCP;
use WooCommerce\PayPalCommerce\Vendor\Inpsyde\Modularity\Module\ExecutableModule;
use WooCommerce\PayPalCommerce\Vendor\Inpsyde\Modularity\Module\ModuleClassNameIdTrait;
use WooCommerce\PayPalCommerce\Vendor\Inpsyde\Modularity\Module\ServiceModule;
use WooCommerce\PayPalCommerce\Vendor\Psr\Container\ContainerInterface;

class IntegrationMockedTestCase extends TestCase
{
	use MockeryPHPUnitIntegration;

	public function setUp(): void
	{
		parent::setUp();
		$this->default_product_id = $this->createAProductIfNotProvided();
	}

	/**
	 * @param int $customer_id
	 * @param string $payment_method
	 * @param int $product_id
	 * @param bool $set_paid
	 * @return \WC_Order|\WP_Error
	 * @throws \WC_Data_Exception
	 */
	public function getMockedOrder(int $customer_id, string $payment_method, int $product_id, bool $set_paid = true)
	{
		$order = wc_create_order([
			'customer_id' => $customer_id,
			'set_paid' => $set_paid,
			'billing' => [
				'first_name' => 'John',
				'last_name' => 'Doe',
				'address_1' => '969 Market',
				'address_2' => '',
				'city' => 'San Francisco',
				'state' => 'CA',
				'postcode' => '94103',
				'country' => 'US',
				'email' => 'john.doe@example.com',
				'phone' => '(555) 555-5555'
			],
			'line_items' => [
				[
					'product_id' => $product_id,
					'quantity' => 1
				]
			],
		]);
		$order->set_payment_method($payment_method);
		// Make sure the order is properly saved
		$order->save();

		// Add the product to the order
		$item = new WC_Order_Item_Product();
		$item->set_props([
			'product_id' => $product_id,
			'quantity' => 1,
			'subtotal' => 10,
			'total' => 10,
		]);
		$order->add_item($item);
		$order->calculate_totals();
		$order->save();
		return $order;
	}

	/**
	 * @param string $sku
	 * @return int
	 */
	public function createAProductIfNotProvided(string $sku = 'DUMMY SUB SKU'): int
	{
		$product_id = wc_get_product_id_by_sku($sku);
		if (!$product_id) {
			$product = new \WC_Product_Subscription();
			$product->set_props([
				'name' => 'Dummy Subscription Product',
				'regular_price' => 10,
				'price' => 10,
				'sku' => 'DUMMY SUB SKU',
				'manage_stock' => false,
				'tax_status' => 'taxable',
				'downloadable' => false,
				'virtual' => false,
				'stock_status' => 'instock',
				'weight' => '1.1',
				// Subscription-specific properties
				'subscription_period' => 'month',
				'subscription_period_interval' => 1,
				'subscription_length' => 0, // 0 means unlimited
				'subscription_trial_period' => '',
				'subscription_trial_length' => 0,
				'subscription_price' => 10,
				'subscription_sign_up_fee' => 0,
			]);
			$product->save();
			$product_id = $product->get_id();
		}
		return $product_id;
	}

	/**
	 * @param array<string, callable> $overriddenServices
	 * @return ContainerInterface
	 */
	protected function bootstrapModule(array $overriddenServices = []): ContainerInterface
	{
		$overriddenServices = array_merge([
			'http.redirector' => function () {
				return new RedirectorStub();
			}
		], $overriddenServices);


		$module = new class ($overriddenServices) implements ServiceModule, ExecutableModule {
			use ModuleClassNameIdTrait;

			public function __construct(array $services)
			{
				$this->services = $services;
			}

			public function services(): array
			{
				return $this->services;
			}

			public function run(ContainerInterface $c): bool
			{
				return true;
			}
		};

		$rootDir = ROOT_DIR;
		$bootstrap = require("$rootDir/bootstrap.php");
		$appContainer = $bootstrap($rootDir, [], [$module]);

		PPCP::init($appContainer);

		return $appContainer;
	}

	public function createCustomerIfNotExists(int $customer_id= 1): int
	{
		$customer = new \WC_Customer($customer_id);
        if (! empty($customer->get_email() )) {
            $customer->set_email('customer'. $customer_id. '@example.com');
            $customer->set_first_name('John');
            $customer->set_last_name('Doe');
            $customer->save();
        }
		return $customer->get_id();
	}

	/**
	 * Creates a payment token for a customer.
	 *
	 * @param int $customer_id The customer ID.
	 * @return WC_Payment_Token_CC The created payment token.
	 * @throws \Exception
	 */
	public function createAPaymentTokenForTheCustomer(int $customer_id = 1, $gateway_id = 'ppcp-gateway'): WC_Payment_Token_CC
	{
		$this->createCustomerIfNotExists($customer_id);

		$token = new WC_Payment_Token_CC();
		$token->set_token('test_token_' . uniqid()); // Unique token ID
		$token->set_gateway_id($gateway_id);
		$token->set_user_id($customer_id);

		// These fields are required for WC_Payment_Token_CC
		$token->set_card_type('visa'); // lowercase is often expected
		$token->set_last4('1234');
		$token->set_expiry_month('12');
		$token->set_expiry_year('2030'); // Missing expiry year in your original code

		$result = $token->save();

		if (!$result || is_wp_error($result)) {
			throw new \Exception('Failed to save payment token: ' .
				(is_wp_error($result) ? $result->get_error_message() : 'Unknown error'));
		}

		$saved_token = \WC_Payment_Tokens::get($token->get_id());
		if (!$saved_token || $saved_token->get_id() !== $token->get_id()) {
			throw new \Exception('Token was not saved correctly');
		}

		return $token;
	}

	/**
	 * Helper method to create a subscription for testing.
	 *
	 * @param int $customer_id The customer ID
	 * @param string $payment_method The payment method
	 * @param string $sku
	 * @return WC_Subscription
	 * @throws \WC_Data_Exception
	 */
	public function createSubscription(int $customer_id = 1, string $payment_method = 'ppcp-gateway', $sku = 'DUMMY SUB SKU'): WC_Subscription
	{
		// Create a product if not provided
		$product_id = $this->createAProductIfNotProvided($sku);

		$order = $this->getMockedOrder($customer_id, $payment_method, $product_id, $set_paid = true);

		$subscription = new WC_Subscription();
		$subscription->set_customer_id($customer_id);
		$subscription->set_payment_method($payment_method);
		$subscription->set_status('active');
		$subscription->set_parent_id($order->get_id());
		$subscription->set_billing_period('month');
		$subscription->set_billing_interval(1);

		// Add a product to the subscription
		$subscription_item = new WC_Order_Item_Product();
		$subscription_item->set_props([
			'product_id' => $product_id,
			'quantity' => 1,
			'subtotal' => 10,
			'total' => 10,
		]);
		$subscription->add_item($subscription_item);
		$subscription->set_date_created(current_time('mysql'));
		$subscription->set_start_date(current_time('mysql'));
		$subscription->set_next_payment_date(date('Y-m-d H:i:s', strtotime('+1 month', current_time('timestamp'))));
		$subscription->save();

		return $subscription;
	}

	/**
	 * Creates a renewal order for testing
	 *
	 * @param int $customer_id
	 * @param string $gateway_id
	 * @param int $subscription_id
	 * @return WC_Order
	 */
	protected function createRenewalOrder(int $customer_id, string $gateway_id, int $subscription_id): WC_Order
	{
		$renewal_order = $this->getMockedOrder($customer_id, $gateway_id, $this->default_product_id, false);
		$renewal_order->update_meta_data('_subscription_renewal', $subscription_id);
		$renewal_order->save();

		return $renewal_order;
	}

	/**
	 * Mocks the OrderEndpoint to return a successful/failed order.
	 *
	 * @param string $intent The order intent (CAPTURE or AUTHORIZE)
	 * @param bool $success Whether the order was successful
	 * @return object The mocked OrderEndpoint
	 */
	public function mockOrderEndpoint(string $intent = 'CAPTURE', bool $success = true): object
	{
		$order_endpoint = $this->getMockBuilder(OrderEndpoint::class)
			->disableOriginalConstructor()
			->getMock();

		$order = $this->getMockBuilder(Order::class)
			->disableOriginalConstructor()
			->getMock();

		$order->method('id')->willReturn('TEST-ORDER-' . uniqid());
		$order->method('intent')->willReturn($intent);
		$order_status = $this->getMockBuilder(OrderStatus::class)
			->disableOriginalConstructor()
			->getMock();
		$order_status->method('is')->willReturn($success);
		$order_status->method('name')->willReturn($success ? 'COMPLETED' : 'FAILED');
		$order->method('status')->willReturn($order_status);
		$payment_source = $this->getMockBuilder(PaymentSource::class)
			->disableOriginalConstructor()
			->getMock();
		$payment_source->method('name')->willReturn('card');
		$order->method('payment_source')->willReturn($payment_source);
		$purchase_unit = $this->getMockBuilder(PurchaseUnit::class)
			->disableOriginalConstructor()
			->getMock();
		$payments = $this->getMockBuilder(Payments::class)
			->disableOriginalConstructor()
			->getMock();
		$capture = $this->getMockBuilder(Capture::class)
			->disableOriginalConstructor()
			->getMock();

		$capture->method('id')->willReturn('TEST-CAPTURE-' . uniqid());
		$capture_status = $this->getMockBuilder(CaptureStatus::class)
			->disableOriginalConstructor()
			->getMock();

		$capture_status->method('name')->willReturn($success ? 'COMPLETED' : 'DECLINED');
		$capture->method('status')->willReturn($capture_status);

		// Mock authorizations for AUTHORIZE intent
		if ($intent === 'AUTHORIZE') {
			$authorization = $this->getMockBuilder(\WooCommerce\PayPalCommerce\ApiClient\Entity\Authorization::class)
				->disableOriginalConstructor()
				->getMock();

			$authorization->method('id')->willReturn('TEST-AUTH-' . uniqid());
			$auth_status = $this->getMockBuilder(\WooCommerce\PayPalCommerce\ApiClient\Entity\AuthorizationStatus::class)
				->disableOriginalConstructor()
				->getMock();

			$auth_status->method('name')->willReturn($success ? 'CREATED' : 'DENIED');
			$auth_status->method('is')->willReturn($success);
			$authorization->method('status')->willReturn($auth_status);
			$payments->method('authorizations')->willReturn([$authorization]);
			$payments->method('captures')->willReturn([]);
		} else {
			// For CAPTURE intent, set up captures but no authorizations
			$payments->method('captures')->willReturn([$capture]);
			$payments->method('authorizations')->willReturn([]);
		}

		$purchase_unit->method('payments')->willReturn($payments);
		$order->method('purchase_units')->willReturn([$purchase_unit]);

		// Set up the order endpoint methods
		$order_endpoint->method('create')->willReturn($order);
		if ($intent === 'AUTHORIZE') {
			$order_endpoint->method('authorize')->willReturn($order);
		} else {
			$order_endpoint->method('capture')->willReturn($order);
		}
		$order_endpoint->method('order')->willReturn($order);

		return $order_endpoint;
	}
}
