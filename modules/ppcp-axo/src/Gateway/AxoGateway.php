<?php
/**
 * The AXO Gateway
 *
 * @package WooCommerce\PayPalCommerce\WcGateway\Gateway
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Axo\Gateway;

use Psr\Log\LoggerInterface;
use Exception;
use WC_AJAX;
use WC_Order;
use WC_Payment_Gateway;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\OrderEndpoint;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PaymentSource;
use WooCommerce\PayPalCommerce\ApiClient\Entity\OrderStatus;
use WooCommerce\PayPalCommerce\ApiClient\Exception\PayPalApiException;
use WooCommerce\PayPalCommerce\ApiClient\Factory\PurchaseUnitFactory;
use WooCommerce\PayPalCommerce\ApiClient\Factory\ShippingPreferenceFactory;
use WooCommerce\PayPalCommerce\ApiClient\Entity\Order;
use WooCommerce\PayPalCommerce\WcGateway\Endpoint\ReturnUrlEndpoint;
use WooCommerce\PayPalCommerce\WcGateway\Exception\PayPalOrderMissingException;
use WooCommerce\PayPalCommerce\WcGateway\Helper\Environment;
use WooCommerce\PayPalCommerce\Vendor\Psr\Container\ContainerInterface;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\GatewaySettingsRendererTrait;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\TransactionUrlProvider;
use WooCommerce\PayPalCommerce\WcGateway\Processor\OrderMetaTrait;
use WooCommerce\PayPalCommerce\WcGateway\Processor\OrderProcessor;
use WooCommerce\PayPalCommerce\WcGateway\Settings\SettingsRenderer;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\ProcessPaymentTrait;
use WooCommerce\PayPalCommerce\WcGateway\Exception\GatewayGenericException;
use WooCommerce\PayPalCommerce\Session\SessionHandler;
use WooCommerce\PayPalCommerce\WcGateway\Helper\CardPaymentsConfiguration;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\Messages;
use DomainException;

/**
 * Class AXOGateway.
 */
class AxoGateway extends WC_Payment_Gateway {
	use OrderMetaTrait, GatewaySettingsRendererTrait, ProcessPaymentTrait;

	const ID = 'ppcp-axo-gateway';

	/**
	 * The Settings Renderer.
	 *
	 * @var SettingsRenderer
	 */
	protected $settings_renderer;

	/**
	 * The settings.
	 *
	 * @var ContainerInterface
	 */
	protected $ppcp_settings;

	/**
	 * Gateway configuration object, providing relevant settings.
	 *
	 * @var CardPaymentsConfiguration
	 */
	protected CardPaymentsConfiguration $dcc_configuration;

	/**
	 * The WcGateway module URL.
	 *
	 * @var string
	 */
	protected $wcgateway_module_url;

	/**
	 * The processor for orders.
	 *
	 * @var OrderProcessor
	 */
	protected $order_processor;

	/**
	 * The card icons.
	 *
	 * @var array
	 */
	protected $card_icons;

	/**
	 * The order endpoint.
	 *
	 * @var OrderEndpoint
	 */
	protected $order_endpoint;

	/**
	 * The purchase unit factory.
	 *
	 * @var PurchaseUnitFactory
	 */
	protected $purchase_unit_factory;

	/**
	 * The shipping preference factory.
	 *
	 * @var ShippingPreferenceFactory
	 */
	protected $shipping_preference_factory;

	/**
	 * The transaction url provider.
	 *
	 * @var TransactionUrlProvider
	 */
	protected $transaction_url_provider;

	/**
	 * The environment.
	 *
	 * @var Environment
	 */
	protected $environment;

	/**
	 * The logger.
	 *
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * The Session Handler.
	 *
	 * @var SessionHandler
	 */
	protected $session_handler;

	/**
	 * AXOGateway constructor.
	 *
	 * @param SettingsRenderer          $settings_renderer           The settings renderer.
	 * @param ContainerInterface        $ppcp_settings               The settings.
	 * @param CardPaymentsConfiguration $dcc_configuration           The DCC Gateway configuration.
	 * @param string                    $wcgateway_module_url        The WcGateway module URL.
	 * @param SessionHandler            $session_handler             The Session Handler.
	 * @param OrderProcessor            $order_processor             The Order processor.
	 * @param array                     $card_icons                  The card icons.
	 * @param OrderEndpoint             $order_endpoint              The order endpoint.
	 * @param PurchaseUnitFactory       $purchase_unit_factory       The purchase unit factory.
	 * @param ShippingPreferenceFactory $shipping_preference_factory The shipping preference factory.
	 * @param TransactionUrlProvider    $transaction_url_provider    The transaction url provider.
	 * @param Environment               $environment                 The environment.
	 * @param LoggerInterface           $logger                      The logger.
	 */
	public function __construct(
		SettingsRenderer $settings_renderer,
		ContainerInterface $ppcp_settings,
		CardPaymentsConfiguration $dcc_configuration,
		string $wcgateway_module_url,
		SessionHandler $session_handler,
		OrderProcessor $order_processor,
		array $card_icons,
		OrderEndpoint $order_endpoint,
		PurchaseUnitFactory $purchase_unit_factory,
		ShippingPreferenceFactory $shipping_preference_factory,
		TransactionUrlProvider $transaction_url_provider,
		Environment $environment,
		LoggerInterface $logger
	) {
		$this->id = self::ID;

		$this->settings_renderer    = $settings_renderer;
		$this->ppcp_settings        = $ppcp_settings;
		$this->dcc_configuration    = $dcc_configuration;
		$this->wcgateway_module_url = $wcgateway_module_url;
		$this->session_handler      = $session_handler;
		$this->order_processor      = $order_processor;
		$this->card_icons           = $card_icons;

		$this->method_title       = __( 'Fastlane Debit & Credit Cards', 'woocommerce-paypal-payments' );
		$this->method_description = __( 'Fastlane accelerates the checkout experience for guest shoppers and autofills their details so they can pay in seconds. When enabled, Fastlane is presented as the default payment method for guests.', 'woocommerce-paypal-payments' );

		if ( apply_filters( 'woocommerce_paypal_payments_axo_gateway_should_update_enabled', true ) ) {
			$is_axo_enabled = $this->dcc_configuration->use_fastlane();
			$this->update_option( 'enabled', $is_axo_enabled ? 'yes' : 'no' );
		}

		$this->title       = apply_filters( 'woocommerce_paypal_payments_axo_gateway_title', $this->dcc_configuration->gateway_title( $this->get_option( 'title', $this->method_title ) ), $this );
		$this->description = apply_filters( 'woocommerce_paypal_payments_axo_gateway_description', __( 'Enter your email address above to continue.', 'woocommerce-paypal-payments' ), $this );

		$this->init_form_fields();
		$this->init_settings();

		add_action(
			'woocommerce_update_options_payment_gateways_' . $this->id,
			array(
				$this,
				'process_admin_options',
			)
		);

		$this->order_endpoint              = $order_endpoint;
		$this->purchase_unit_factory       = $purchase_unit_factory;
		$this->shipping_preference_factory = $shipping_preference_factory;
		$this->logger                      = $logger;

		$this->transaction_url_provider = $transaction_url_provider;
		$this->environment              = $environment;
	}

	/**
	 * Initialize the form fields.
	 */
	public function init_form_fields() {
		$this->form_fields = array(
			'enabled' => array(
				'title'       => __( 'Enable/Disable', 'woocommerce-paypal-payments' ),
				'type'        => 'checkbox',
				'label'       => __( 'AXO', 'woocommerce-paypal-payments' ),
				'default'     => 'no',
				'desc_tip'    => true,
				'description' => __( 'Enable/Disable AXO payment gateway.', 'woocommerce-paypal-payments' ),
			),
			'ppcp'    => array(
				'type' => 'ppcp',
			),
		);
	}

	/**
	 * Processes the order.
	 *
	 * @param int $order_id The WC order ID.
	 *
	 * @return array
	 */
	public function process_payment( $order_id ) {
		$wc_order = wc_get_order( $order_id );

		if ( ! is_a( $wc_order, WC_Order::class ) ) {
			return array(
				'result'  => 'failure',
				'message' => __( 'Order not found. Please try again.', 'woocommerce-paypal-payments' ),
			);
		}

		// Check for stored 3DS errors.
		$stored_error = $this->get_and_clear_stored_error();
		if ( $stored_error ) {
			return array(
				'result'  => 'failure',
				'message' => $stored_error['message'],
			);
		}

		$existing_order = $this->session_handler->order();

		if ( $existing_order ) {
			// Check if this session order belongs to current WC order and we're in 3DS context.
			$session_order_belongs_to_current_wc_order = $this->session_order_matches_wc_order( $existing_order, $wc_order );
			$is_3ds_context                            = $this->is_3ds_context();

			if ( $session_order_belongs_to_current_wc_order && $is_3ds_context ) {
				// This is a legitimate 3DS return for the current order.
				try {
					/**
					 * This filter controls if the method 'process()' from OrderProcessor will be called.
					 */
					$process = apply_filters( 'woocommerce_paypal_payments_before_order_process', true, $this, $wc_order );
					if ( $process ) {
						$this->order_processor->process_captured_and_authorized( $wc_order, $existing_order );
					}

					// Clear session after successful processing.
					$this->session_handler->destroy_session_data();
					WC()->cart->empty_cart();

					return array(
						'result'   => 'success',
						'redirect' => $this->get_return_url( $wc_order ),
					);

				} catch ( Exception $exception ) {
					// Handle 3DS processing failures with universal error approach.
					// Clear session data since payment failed.
					$this->session_handler->destroy_session_data();

					return array(
						'result'  => 'failure',
						'message' => $this->get_user_friendly_error_message( $exception ),
					);
				}
			} else {
				// Session order doesn't belong to current WC order OR not 3DS context.
				$this->session_handler->destroy_session_data();
			}
		}

		// No existing order or cleared session - this is an initial payment.
		try {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$fastlane_member = wc_clean( wp_unslash( $_POST['fastlane_member'] ?? '' ) );
			if ( $fastlane_member ) {
				$payment_method_title = __( 'Debit & Credit Cards (via Fastlane by PayPal)', 'woocommerce-paypal-payments' );
				$wc_order->set_payment_method_title( $payment_method_title );
				$wc_order->save();
			}

			// The `axo_nonce` is not a WP nonce, but a card-token generated by the JS SDK.
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$token = wc_clean( wp_unslash( $_POST['axo_nonce'] ?? '' ) );

			// Enhanced token validation with universal error handling.
			if ( empty( $token ) ) {
				// Universal error return.
				return array(
					'result'  => 'failure',
					'message' => $this->is_3ds_context()
						? __( 'Payment session expired. Please try your payment again.', 'woocommerce-paypal-payments' )
						: __( 'No payment token provided. Please try again.', 'woocommerce-paypal-payments' ),
				);
			}

			$order = $this->create_paypal_order( $wc_order, $token );

			// Check if 3DS verification is required.
			$payer_action = $this->get_payer_action_url( $order );

			// If 3DS verification is required, store order and redirect.
			if ( $payer_action ) {
				// Store the order in session before 3DS redirect.
				$this->session_handler->replace_order( $order );

				$return_url = home_url( WC_AJAX::get_endpoint( ReturnUrlEndpoint::ENDPOINT ) );

				$redirect_url = add_query_arg(
					'redirect_uri',
					urlencode( $return_url ),
					$payer_action
				);

				return array(
					'result'   => 'success',
					'redirect' => $redirect_url,
				);
			}

			/**
			 * This filter controls if the method 'process()' from OrderProcessor will be called.
			 * So you can implement your own for example on subscriptions
			 *
			 * - true bool controls execution of 'OrderProcessor::process()'
			 * - $this \WC_Payment_Gateway
			 * - $wc_order \WC_Order
			 */
			$process = apply_filters( 'woocommerce_paypal_payments_before_order_process', true, $this, $wc_order );
			if ( $process ) {
				$this->order_processor->process_captured_and_authorized( $wc_order, $order );
			}
		} catch ( Exception $exception ) {
			// Error handling for initial payment failures.
			return array(
				'result'  => 'failure',
				'message' => $this->get_user_friendly_error_message( $exception ),
			);
		}

		WC()->cart->empty_cart();

		return array(
			'result'   => 'success',
			'redirect' => $this->get_return_url( $wc_order ),
		);
	}

	/**
	 * Get and clear stored payment errors.
	 */
	private function get_and_clear_stored_error() {
		if ( ! WC()->session ) {
			return null;
		}

		$stored_error = WC()->session->get( 'ppcp_payment_error' );
		if ( $stored_error ) {
			WC()->session->__unset( 'ppcp_payment_error' );
			return $stored_error;
		}

		return null;
	}

	/**
	 * Convert exceptions to user-friendly messages.
	 */
	private function get_user_friendly_error_message( Exception $exception ) {
		$error_message = $exception->getMessage();

		// Handle specific error types with user-friendly messages.
		if ( $exception instanceof DomainException ) {
			if ( strpos( $error_message, 'Could not capture' ) !== false ) {
				return __( '3D Secure authentication was unavailable or failed. Please try a different payment method or contact your bank.', 'woocommerce-paypal-payments' );
			}
		}

		if ( strpos( $error_message, 'declined' ) !== false ||
			strpos( $error_message, 'PAYMENT_DENIED' ) !== false ||
			strpos( $error_message, 'INSTRUMENT_DECLINED' ) !== false ||
			strpos( $error_message, 'Payment provider declined' ) !== false ) {
			return __( 'Your payment was declined after 3D Secure verification. Please try a different payment method or contact your bank.', 'woocommerce-paypal-payments' );
		}

		if ( strpos( $error_message, 'session' ) !== false ||
			strpos( $error_message, 'expired' ) !== false ) {
			return __( 'Payment session expired. Please try your payment again.', 'woocommerce-paypal-payments' );
		}

		return __( 'There was an error processing your payment. Please try again or contact support.', 'woocommerce-paypal-payments' );
	}

	/**
	 * Extract payer action URL from PayPal order.
	 */
	private function get_payer_action_url( Order $order ) {
		foreach ( $order->links() as $link ) {
			if ( $link->rel === 'payer-action' ) {
				return $link->href;
			}
		}
		return '';
	}

	/**
	 * Check if session order belongs to current WC order.
	 *
	 * @param Order    $paypal_order The PayPal order from session.
	 * @param WC_Order $wc_order The current WooCommerce order.
	 * @return bool
	 */
	private function session_order_matches_wc_order( Order $paypal_order, WC_Order $wc_order ): bool {
		$paypal_custom_id = $paypal_order->purchase_units()[0]->custom_id() ?? '';
		$wc_order_id      = (string) $wc_order->get_id();

		return $paypal_custom_id === $wc_order_id;
	}

	/**
	 * Check if we're in a 3DS return context.
	 *
	 * @return bool
	 */
	private function is_3ds_context(): bool {
		// Check referer for PayPal.
		$referer = $_SERVER['HTTP_REFERER'] ?? '';
		if ( strpos( $referer, 'paypal.com' ) !== false ) {
			return true;
		}

		// Check for 3DS-specific parameters.
		$three_ds_params = array( 'liability_shift', 'state', 'code', 'authentication_state' );
		foreach ( $three_ds_params as $param ) {
			if ( isset( $_GET[ $param ] ) ) {
				return true;
			}
		}

		// Check if we're being called by ReturnUrlEndpoint.
		if ( isset( $_GET['wc-ajax'] ) && $_GET['wc-ajax'] === 'ppc-return-url' ) {
			return true;
		}

		return false;
	}

	/**
	 * Create a new PayPal order from the existing WC_Order instance.
	 *
	 * @param WC_Order $wc_order      The WooCommerce order to use as a base.
	 * @param string   $payment_token The payment token, generated by the JS SDK.
	 *
	 * @return Order The PayPal order.
	 */
	protected function create_paypal_order( WC_Order $wc_order, string $payment_token ) : Order {

		$purchase_unit = $this->purchase_unit_factory->from_wc_order( $wc_order );

		$shipping_preference = $this->shipping_preference_factory->from_state(
			$purchase_unit,
			'checkout'
		);

		$payment_source_properties = (object) array(
			'single_use_token' => $payment_token,
		);

		$payment_source = new PaymentSource(
			'card',
			$payment_source_properties
		);

		return $this->order_endpoint->create(
			array( $purchase_unit ),
			$shipping_preference,
			null,
			self::ID,
			array(),
			$payment_source
		);
	}

	/**
	 * Returns the icons of the gateway.
	 *
	 * @return string
	 */
	public function get_icon() {
		$icon  = parent::get_icon();
		$icons = $this->card_icons;

		if ( ! $icons ) {
			return $icon;
		}

		$images = array();

		foreach ( $icons as $card ) {
			$images[] = '<img
				class="ppcp-card-icon"
				title="' . esc_attr( $card['title'] ) . '"
				src="' . esc_url( $card['url'] ) . '"
			> ';
		}

		return implode( '', $images );
	}

	/**
	 * Return transaction url for this gateway and given order.
	 *
	 * @param WC_Order $order WC order to get transaction url by.
	 *
	 * @return string
	 */
	public function get_transaction_url( $order ) : string {
		$this->view_transaction_url = $this->transaction_url_provider->get_transaction_url_base( $order );

		return parent::get_transaction_url( $order );
	}

	/**
	 * Return the gateway's title.
	 *
	 * @return string
	 */
	public function get_title() {
		if ( is_admin() ) {
			// $theorder and other things for retrieving the order or post info are not available
			// in the constructor, so must do it here.
			global $theorder;
			if ( $theorder instanceof WC_Order ) {
				if ( $theorder->get_payment_method() === self::ID ) {
					$payment_method_title = $theorder->get_payment_method_title();
					if ( $payment_method_title ) {
						$this->title = $payment_method_title;
					}
				}
			}
		}

		return parent::get_title();
	}

	/**
	 * Returns the settings renderer.
	 *
	 * @return SettingsRenderer
	 */
	protected function settings_renderer() : SettingsRenderer {
		return $this->settings_renderer;
	}
}
