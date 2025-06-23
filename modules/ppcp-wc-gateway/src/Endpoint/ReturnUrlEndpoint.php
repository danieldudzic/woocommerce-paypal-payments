<?php
/**
 * Controls the endpoint for customers returning from PayPal.
 *
 * @package WooCommerce\PayPalCommerce\WcGateway\Endpoint
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\WcGateway\Endpoint;

use DomainException;
use Psr\Log\LoggerInterface;
use Exception;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\OrderEndpoint;
use WooCommerce\PayPalCommerce\ApiClient\Entity\OrderStatus;
use WooCommerce\PayPalCommerce\Session\SessionHandler;
use WooCommerce\PayPalCommerce\ApiClient\Exception\RuntimeException;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\OXXO\OXXOGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayPalGateway;

/**
 * Class ReturnUrlEndpoint
 */
class ReturnUrlEndpoint {

	const ENDPOINT = 'ppc-return-url';

	/**
	 * The PayPal Gateway.
	 *
	 * @var PayPalGateway
	 */
	private $gateway;

	/**
	 * The Order Endpoint.
	 *
	 * @var OrderEndpoint
	 */
	private $order_endpoint;

	/**
	 * The session handler
	 *
	 * @var SessionHandler
	 */
	protected $session_handler;

	/**
	 * The logger.
	 *
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * ReturnUrlEndpoint constructor.
	 *
	 * @param PayPalGateway   $gateway         The PayPal Gateway.
	 * @param OrderEndpoint   $order_endpoint  The Order Endpoint.
	 * @param SessionHandler  $session_handler The session handler.
	 * @param LoggerInterface $logger          The logger.
	 */
	public function __construct(
		PayPalGateway $gateway,
		OrderEndpoint $order_endpoint,
		SessionHandler $session_handler,
		LoggerInterface $logger
	) {
		$this->gateway         = $gateway;
		$this->order_endpoint  = $order_endpoint;
		$this->session_handler = $session_handler;
		$this->logger          = $logger;
	}

	/**
	 * Handles the incoming request.
	 */
	public function handle_request(): void {
		// Initialize WC session for AJAX endpoints.
		if ( ! WC()->session ) {
			WC()->initialize_session();
		}

		if ( ! WC()->session->get_session_cookie() ) {
			WC()->session->set_customer_session_cookie( true );
		}

		// Check if we have a PayPal order in session (3DS return).
		$order = $this->session_handler->order();

		if ( $order ) {
			try {
				// Handle 3DS capture before processing.
				$order = $this->handle_3ds_return( $order );

				$wc_order_id = (int) $order->purchase_units()[0]->custom_id();
				$wc_order    = wc_get_order( $wc_order_id );

				if ( ! $wc_order ) {
					wc_add_notice( __( 'Order information is missing. Please try placing your order again.', 'woocommerce-paypal-payments' ), 'error' );
					wp_safe_redirect( wc_get_checkout_url() );
					exit();
				}

				$payment_gateway = $this->get_payment_gateway( $wc_order->get_payment_method() );
				if ( ! $payment_gateway ) {
					wc_add_notice( __( 'Payment gateway is unavailable. Please try again or contact support.', 'woocommerce-paypal-payments' ), 'error' );
					wp_safe_redirect( wc_get_checkout_url() );
					exit();
				}

				$result = $payment_gateway->process_payment( $wc_order_id );

				if ( isset( $result['result'] ) && $result['result'] === 'success' ) {
					wp_safe_redirect( $result['redirect'] );
					exit();
				}

				wc_add_notice( __( 'Payment processing failed. Please try again or contact support.', 'woocommerce-paypal-payments' ), 'error' );
				wp_safe_redirect( wc_get_checkout_url() );
				exit();

			} catch ( Exception $e ) {
				wc_add_notice( __( 'There was an error processing your payment. Please try again or contact support.', 'woocommerce-paypal-payments' ), 'error' );
				wp_safe_redirect( wc_get_checkout_url() );
				exit();
			}
		}

		// No order in session - handle regular PayPal returns.
		if ( ! isset( $_GET['token'] ) ) {
			wc_add_notice( __( 'Payment session expired. Please try placing your order again.', 'woocommerce-paypal-payments' ), 'error' );
			wp_safe_redirect( wc_get_checkout_url() );
			exit();
		}

		// Handle regular PayPal returns (non-3DS).
		// phpcs:enable WordPress.Security.NonceVerification.Recommended
		$token = sanitize_text_field( wp_unslash( $_GET['token'] ) );

		try {
			$order = $this->order_endpoint->order( $token );
		} catch ( Exception $exception ) {
			wc_add_notice( __( 'Could not retrieve payment information. Please try again.', 'woocommerce-paypal-payments' ), 'error' );
			wp_safe_redirect( wc_get_checkout_url() );
			exit();
		}

		if ( $order->status()->is( OrderStatus::APPROVED ) || $order->status()->is( OrderStatus::COMPLETED ) ) {
			$this->session_handler->replace_order( $order );
		}

		$wc_order_id = (int) $order->purchase_units()[0]->custom_id();
		if ( ! $wc_order_id ) {
			// We cannot finish processing here without WC order, but at least go into the continuation mode.
			if ( $order->status()->is( OrderStatus::APPROVED )
				|| $order->status()->is( OrderStatus::COMPLETED )
			) {
				wp_safe_redirect( wc_get_checkout_url() );
				exit();
			}

			$this->logger->warning( "Return URL endpoint $token: no WC order ID." );
			wc_add_notice( __( 'Order information is missing. Please try placing your order again.', 'woocommerce-paypal-payments' ), 'error' );
			wp_safe_redirect( wc_get_checkout_url() );
			exit();
		}

		$wc_order = wc_get_order( $wc_order_id );
		if ( ! is_a( $wc_order, \WC_Order::class ) ) {
			$this->logger->warning( "Return URL endpoint $token: WC order $wc_order_id not found." );

			wc_add_notice( __( 'Order not found. Please try placing your order again.', 'woocommerce-paypal-payments' ), 'error' );
			wp_safe_redirect( wc_get_checkout_url() );
			exit();
		}

		// Handle different gateway types.
		if ( $wc_order->get_payment_method() === OXXOGateway::ID ) {
			$this->session_handler->destroy_session_data();
			wp_safe_redirect( wc_get_checkout_url() );
			exit();
		}

		$payment_gateway = $this->get_payment_gateway( $wc_order->get_payment_method() );
		if ( ! $payment_gateway ) {
			wc_add_notice( __( 'Payment gateway is unavailable. Please try again or contact support.', 'woocommerce-paypal-payments' ), 'error' );
			wp_safe_redirect( wc_get_checkout_url() );
			exit();
		}

		$success = $payment_gateway->process_payment( $wc_order_id );

		if ( isset( $success['result'] ) && 'success' === $success['result'] ) {
			add_filter(
				'allowed_redirect_hosts',
				function( $allowed_hosts ) : array {
					$allowed_hosts[] = 'www.paypal.com';
					$allowed_hosts[] = 'www.sandbox.paypal.com';
					return (array) $allowed_hosts;
				}
			);
			wp_safe_redirect( $success['redirect'] );
			exit();
		}

		wc_add_notice( __( 'Payment processing failed. Please try again or contact support.', 'woocommerce-paypal-payments' ), 'error' );
		wp_safe_redirect( wc_get_checkout_url() );
		exit();
	}


	/**
	 * Handle 3DS return and capture order if needed.
	 *
	 * @param mixed $order The PayPal order.
	 * @return mixed The processed order.
	 */
	private function handle_3ds_return( $order ) {
		// If order is still CREATED after 3DS, it needs to be captured.
		if ( $order->status()->is( OrderStatus::CREATED ) ) {
			try {
				// Capture the order.
				$captured_order = $this->order_endpoint->capture( $order );

				// Check if capture actually succeeded vs. payment declined.
				if ( $captured_order->status()->is( OrderStatus::COMPLETED ) ) {
					// Update session with captured order.
					$this->session_handler->replace_order( $captured_order );
					return $captured_order;
				} else {
					// Capture API succeeded but payment was declined.
					throw new Exception( __( 'Payment was declined by the payment provider. Please try a different payment method.', 'woocommerce-paypal-payments' ) );
				}
			} catch ( DomainException $e ) {
				// Handle 3DS authentication failures (Test Case 4: Unavailable).
				// Clear session data since authentication failed.
				$this->session_handler->destroy_session_data();

				// Use native WooCommerce error handling.
				wc_add_notice( __( '3D Secure authentication was unavailable or failed. Please try a different payment method or contact your bank.', 'woocommerce-paypal-payments' ), 'error' );
				wp_safe_redirect( wc_get_checkout_url() );
				exit();

			} catch ( RuntimeException $e ) {
				if ( strpos( $e->getMessage(), 'declined' ) !== false ||
					strpos( $e->getMessage(), 'PAYMENT_DENIED' ) !== false ||
					strpos( $e->getMessage(), 'INSTRUMENT_DECLINED' ) !== false ||
					strpos( $e->getMessage(), 'Payment provider declined' ) !== false ) {

					$this->session_handler->destroy_session_data();

					wc_add_notice( __( 'Your payment was declined after 3D Secure verification. Please try a different payment method or contact your bank.', 'woocommerce-paypal-payments' ), 'error' );
					wp_safe_redirect( wc_get_checkout_url() );
					exit();
				}
				throw $e;
			} catch ( Exception $e ) {
				$this->session_handler->destroy_session_data();
				wc_add_notice( __( 'There was an error processing your payment. Please try again or contact support.', 'woocommerce-paypal-payments' ), 'error' );
				wp_safe_redirect( wc_get_checkout_url() );
				exit();
			}
		}

		return $order;
	}
	/**
	 * Gets the appropriate payment gateway for the given payment method.
	 *
	 * @param string $payment_method The payment method ID.
	 * @return \WC_Payment_Gateway|null
	 */
	private function get_payment_gateway( string $payment_method ) {

		// For regular PayPal payments, use the injected gateway.
		if ( $payment_method === $this->gateway->id ) {
			return $this->gateway;
		}

		// For other payment methods (like AXO), get from WooCommerce.
		$available_gateways = WC()->payment_gateways->get_available_payment_gateways();

		if ( isset( $available_gateways[ $payment_method ] ) ) {
			return $available_gateways[ $payment_method ];
		}

		return null;
	}
}
