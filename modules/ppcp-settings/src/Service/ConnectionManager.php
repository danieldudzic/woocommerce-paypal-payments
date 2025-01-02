<?php
/**
 * Manages the merchant connection between this plugin and PayPal.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Service;

use Psr\Log\LoggerInterface;
use RuntimeException;
use WooCommerce\PayPalCommerce\ApiClient\Authentication\PayPalBearer;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\Orders;
use WooCommerce\PayPalCommerce\ApiClient\Helper\InMemoryCache;
use WooCommerce\PayPalCommerce\Settings\Data\CommonSettings;

/**
 * Class that manages the connection to PayPal.
 */
class ConnectionManager {
	/**
	 * Data model that stores the connection details.
	 *
	 * @var CommonSettings
	 */
	private CommonSettings $common_settings;

	/**
	 * Logging instance.
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * Base URLs for the manual connection attempt.
	 *
	 * @var array<string, string>
	 */
	private array $connection_hosts;

	/**
	 * Constructor.
	 *
	 * @param CommonSettings  $common_settings Data model that stores the connection details.
	 * @param string          $live_host       The API host for the live mode.
	 * @param string          $sandbox_host    The API host for the sandbox mode.
	 * @param LoggerInterface $logger          Logging instance.
	 */
	public function __construct( CommonSettings $common_settings, string $live_host, string $sandbox_host, LoggerInterface $logger ) {
		$this->common_settings  = $common_settings;
		$this->logger           = $logger;
		$this->connection_hosts = array(
			'live'    => $live_host,
			'sandbox' => $sandbox_host,
		);
	}

	/**
	 * Returns details about the currently connected merchant.
	 *
	 * @return array
	 */
	public function get_account_details() : array {
		return array(
			'is_sandbox'     => $this->common_settings->is_sandbox_merchant(),
			'is_connected'   => $this->common_settings->is_merchant_connected(),
			'merchant_id'    => $this->common_settings->get_merchant_id(),
			'merchant_email' => $this->common_settings->get_merchant_email(),
		);
	}

	/**
	 * Removes any connection details we currently have stored.
	 *
	 * @return void
	 */
	public function disconnect() : void {
		$this->logger->info( 'Disconnecting merchant from PayPal...' );

		$this->common_settings->reset_merchant_data();
		$this->common_settings->save();
	}

	/**
	 * Checks if the provided ID and secret have a valid format.
	 *
	 * Part of the "Direct Connection" (Manual Connection) flow.
	 *
	 * On failure, an Exception is thrown, while a successful check does not
	 * generate any return value.
	 *
	 * @param string $client_id     The client ID.
	 * @param string $client_secret The client secret.
	 * @return void
	 * @throws RuntimeException When invalid client ID or secret provided.
	 */
	public function validate_id_and_secret( string $client_id, string $client_secret ) : void {
		if ( empty( $client_id ) ) {
			throw new RuntimeException( 'No client ID provided.' );
		}

		if ( false === preg_match( '/^A[\w-]{79}$/', $client_secret ) ) {
			throw new RuntimeException( 'Invalid client ID provided.' );
		}

		if ( empty( $client_secret ) ) {
			throw new RuntimeException( 'No client secret provided.' );
		}
	}

	/**
	 * Disconnects the current merchant, and then attempts to connect to a
	 * PayPal account using a client ID and secret.
	 *
	 * Part of the "Direct Connection" (Manual Connection) flow.
	 *
	 * @param bool   $use_sandbox   Whether to use the sandbox mode.
	 * @param string $client_id     The client ID.
	 * @param string $client_secret The client secret.
	 * @return void
	 * @throws RuntimeException When failed to retrieve payee.
	 */
	public function connect_via_secret( bool $use_sandbox, string $client_id, string $client_secret ) : void {
		$this->disconnect();

		$this->logger->info(
			'Attempting manual connection to PayPal...',
			array(
				'sandbox'   => $use_sandbox,
				'client_id' => $client_id,
			)
		);

		$payee = $this->request_payee( $client_id, $client_secret, $use_sandbox );

		$this->update_connection_details( $use_sandbox, $payee['merchant_id'], $payee['email_address'] );
	}


	// ----------------------------------------------------------------------------
	// Internal helper methods


	/**
	 * Returns the API host for the relevant environment.
	 *
	 * @param bool $for_sandbox Whether to return the sandbox API host.
	 * @return string
	 */
	private function get_host( bool $for_sandbox = false ) : string {
		return $for_sandbox ? $this->connection_hosts['sandbox'] : $this->connection_hosts['live'];
	}

	/**
	 * Retrieves the payee object with the merchant data by creating a minimal PayPal order.
	 *
	 * @param string $client_id     The client ID.
	 * @param string $client_secret The client secret.
	 * @param bool   $use_sandbox   Whether to use the sandbox mode.
	 *
	 * @return array Payee details, containing 'merchant_id' and 'merchant_email' keys.
	 * @throws RuntimeException When failed to retrieve payee.
	 */
	private function request_payee(
		string $client_id,
		string $client_secret,
		bool $use_sandbox
	) : array {
		$host = $this->get_host( $use_sandbox );

		$bearer = new PayPalBearer(
			new InMemoryCache(),
			$host,
			$client_id,
			$client_secret,
			$this->logger,
			null
		);

		$orders = new Orders(
			$host,
			$bearer,
			$this->logger
		);

		$request_body = array(
			'intent'         => 'CAPTURE',
			'purchase_units' => array(
				array(
					'amount' => array(
						'currency_code' => 'USD',
						'value'         => 1.0,
					),
				),
			),
		);

		$response = $orders->create( $request_body );
		$body     = json_decode( $response['body'] );

		$order_id = $body->id;

		$order_response = $orders->order( $order_id );
		$order_body     = json_decode( $order_response['body'] );

		$pu    = $order_body->purchase_units[0];
		$payee = $pu->payee;

		if ( ! is_object( $payee ) ) {
			throw new RuntimeException( 'Payee not found.' );
		}
		if ( ! isset( $payee->merchant_id ) || ! isset( $payee->email_address ) ) {
			throw new RuntimeException( 'Payee info not found.' );
		}

		return array(
			'merchant_id'   => $payee->merchant_id,
			'email_address' => $payee->email_address,
		);
	}

	/**
	 * Stores the provided details in the data model.
	 *
	 * @param bool   $is_sandbox     Whether the details are for a sandbox account.
	 * @param string $merchant_id    PayPal's internal merchant ID.
	 * @param string $merchant_email Email address associated with the PayPal account.
	 * @return void
	 */
	private function update_connection_details( bool $is_sandbox, string $merchant_id, string $merchant_email ) : void {
		$this->logger->info(
			'Updating connection details',
			array(
				'sandbox'        => $is_sandbox,
				'merchant_id'    => $merchant_id,
				'merchant_email' => $merchant_email,
			)
		);

		$this->common_settings->set_merchant_data( $is_sandbox, $merchant_id, $merchant_email );
		$this->common_settings->save();
	}
}
