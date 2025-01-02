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
use JsonException;
use WooCommerce\PayPalCommerce\ApiClient\Authentication\PayPalBearer;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\Orders;
use WooCommerce\PayPalCommerce\ApiClient\Helper\InMemoryCache;
use WooCommerce\PayPalCommerce\Settings\Data\CommonSettings;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\LoginSeller;
use WooCommerce\WooCommerce\Logging\Logger\NullLogger;
use WooCommerce\PayPalCommerce\ApiClient\Repository\PartnerReferralsData;
use Automattic\Jetpack\Partner;

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
	 * Base URLs for the manual connection attempt, by environment.
	 *
	 * @var array<string, string>
	 */
	private array $connection_hosts;

	/**
	 * Login API handler instances, by environment.
	 *
	 * @var array<string, LoginSeller>
	 */
	private array $login_endpoints;

	/**
	 * Onboarding referrals data.
	 *
	 * @var PartnerReferralsData
	 */
	private PartnerReferralsData $referrals_data;

	/**
	 * Constructor.
	 *
	 * @param CommonSettings       $common_settings        Data model that stores the connection
	 *                                                     details.
	 * @param string               $live_host              The API host for the live mode.
	 * @param string               $sandbox_host           The API host for the sandbox mode.
	 * @param LoginSeller          $live_login_endpoint    API handler to fetch live-merchant
	 *                                                     credentials.
	 * @param LoginSeller          $sandbox_login_endpoint API handler to fetch sandbox-merchant
	 *                                                     credentials.
	 * @param PartnerReferralsData $referrals_data         Partner referrals data.
	 * @param ?LoggerInterface     $logger                 Logging instance.
	 */
	public function __construct(
		CommonSettings $common_settings, string $live_host, string $sandbox_host,
		LoginSeller $live_login_endpoint, LoginSeller $sandbox_login_endpoint,
		PartnerReferralsData $referrals_data,
		?LoggerInterface $logger = null
	) {
		$this->common_settings = $common_settings;
		$this->logger          = $logger ?: new NullLogger();

		$this->connection_hosts = array(
			'live'    => $live_host,
			'sandbox' => $sandbox_host,
		);
		$this->login_endpoints  = array(
			'live'    => $live_login_endpoint,
			'sandbox' => $sandbox_login_endpoint,
		);
		$this->referrals_data   = $referrals_data;
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


	/**
	 * Checks if the provided ID and auth-code have a valid format.
	 *
	 * Part of the "ISU Connection" (login via Popup) flow.
	 *
	 * On failure, an Exception is thrown, while a successful check does not
	 * generate any return value. Note, that we did not find official documentation
	 * on those values, so we only check if they are non-empty strings.
	 *
	 * @param string $shared_id The shared onboarding ID.
	 * @param string $auth_code The authorization code.
	 * @return void
	 * @throws RuntimeException When invalid shared ID or auth provided.
	 */
	public function validate_id_and_auth_code( string $shared_id, string $auth_code ) : void {
		if ( empty( $shared_id ) ) {
			throw new RuntimeException( 'No onboarding ID provided.' );
		}

		if ( empty( $auth_code ) ) {
			throw new RuntimeException( 'No authorization code provided.' );
		}
	}

	/**
	 * Disconnects the current merchant, and then attempts to connect to a
	 * PayPal account the onboarding ID and authorization ID.
	 *
	 * Part of the "ISU Connection" (login via Popup) flow.
	 *
	 * @param bool   $use_sandbox Whether to use the sandbox mode.
	 * @param string $shared_id   The shared onboarding ID.
	 * @param string $auth_code   The authorization code.
	 * @return void
	 * @throws RuntimeException When failed to retrieve payee.
	 */
	public function connect_via_auth_code( bool $use_sandbox, string $shared_id, string $auth_code ) : void {
		$this->disconnect();

		$this->logger->info(
			'Attempting ISU login to PayPal...',
			array(
				'sandbox'   => $use_sandbox,
				'shared_id' => $shared_id,
			)
		);

		$credentials = $this->get_credentials( $shared_id, $auth_code, $use_sandbox );

		// TODO.
		// $this->update_connection_details( $use_sandbox, $payee['merchant_id'], $payee['email_address'] );
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
	 * Returns an API handler to fetch merchant credentials.
	 *
	 * @param bool $for_sandbox Whether to return the sandbox API handler.
	 * @return LoginSeller
	 */
	private function get_login_endpoint( bool $for_sandbox = false ) : LoginSeller {
		return $for_sandbox ? $this->login_endpoints['sandbox'] : $this->login_endpoints['live'];
	}

	/**
	 * Retrieves the payee object with the merchant data by creating a minimal PayPal order.
	 *
	 * Part of the "Direct Connection" (Manual Connection) flow.
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

		try {
			$response = $orders->create( $request_body );
			$body     = json_decode( $response['body'], false, 512, JSON_THROW_ON_ERROR );
			$order_id = $body->id;

			$order_response = $orders->order( $order_id );
			$order_body     = json_decode( $order_response['body'], false, 512, JSON_THROW_ON_ERROR );
		} catch ( JsonException $exception ) {
			throw new RuntimeException( 'Could not decode JSON response: ' . $exception->getMessage() );
		}

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
	 * Fetches merchant API credentials using a shared onboarding ID and
	 * authorization code.
	 *
	 * Part of the "ISU Connection" (login via Popup) flow.
	 *
	 * @param string $shared_id   The shared onboarding ID.
	 * @param string $auth_code   The authorization code.
	 * @param bool   $use_sandbox Whether to use the sandbox mode.
	 * @return array
	 */
	private function get_credentials( string $shared_id, string $auth_code, bool $use_sandbox ) : array {
		$login_handler = $this->get_login_endpoint( $use_sandbox );
		$nonce         = $this->referrals_data->nonce();

		// TODO. Always throws the exception "No token found."
		$response = $login_handler->credentials_for( $shared_id, $auth_code, $nonce );

		// TODO.
		return (array) $response;
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
