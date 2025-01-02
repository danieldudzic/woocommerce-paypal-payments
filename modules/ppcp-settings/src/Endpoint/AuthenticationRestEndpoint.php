<?php
/**
 * REST controller for authenticating a PayPal merchant.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Endpoint
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Endpoint;

use Exception;
use stdClass;
use RuntimeException;
use Psr\Log\LoggerInterface;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WooCommerce\PayPalCommerce\ApiClient\Authentication\PayPalBearer;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\Orders;
use WooCommerce\PayPalCommerce\ApiClient\Helper\InMemoryCache;
use WooCommerce\PayPalCommerce\Settings\Data\GeneralSettings;
use WooCommerce\PayPalCommerce\Settings\Service\ConnectionManager;

/**
 * REST controller for authenticating and connecting to a PayPal merchant account.
 *
 * This endpoint is responsible for verifying credentials and establishing
 * a connection, regardless of whether they are provided via:
 * 1. Direct login (clientId + secret)
 * 2. UI-driven login (sharedId + authCode)
 *
 * It handles the actual authentication process after the login URL has been used.
 */
class AuthenticationRestEndpoint extends RestEndpoint {
	/**
	 * The base path for this REST controller.
	 *
	 * @var string
	 */
	protected $rest_base = 'authenticate';

	/**
	 * Defines the JSON response format (when connection was successful).
	 *
	 * @var array
	 */
	private array $response_map = array(
		'merchant_id'    => array(
			'js_name' => 'merchantId',
		),
		'merchant_email' => array(
			'js_name' => 'email',
		),
	);

	/**
	 * Constructor.
	 *
	 * @param ConnectionManager $connection_manager The connection manager.
	 */
	public function __construct( ConnectionManager $connection_manager ) {
		$this->connection_manager = $connection_manager;
	}

	/**
	 * Configure REST API routes.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/direct',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'connect_direct' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'clientId'     => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'minLength'         => 80,
						'maxLength'         => 80,
					),
					'clientSecret' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'useSandbox'   => array(
						'required'          => false,
						'type'              => 'boolean',
						'default'           => false,
						'sanitize_callback' => array( $this, 'to_boolean' ),
					),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/isu',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'connect_isu' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'sharedId'   => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'authCode'   => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'useSandbox' => array(
						'default'           => 0,
						'type'              => 'boolean',
						'sanitize_callback' => array( $this, 'to_boolean' ),
					),
				),
			)
		);
	}

	/**
	 * Direct login: Retrieves merchantId and email using clientId and clientSecret.
	 *
	 * This is the "Manual Login" logic, when a merchant already knows their
	 * API credentials.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function connect_direct( WP_REST_Request $request ) : WP_REST_Response {
		$client_id     = $request->get_param( 'clientId' );
		$client_secret = $request->get_param( 'clientSecret' );
		$use_sandbox   = $request->get_param( 'useSandbox' );

		try {
			$this->connection_manager->validate_id_and_secret( $client_id, $client_secret );
			$this->connection_manager->connect_via_secret( $use_sandbox, $client_id, $client_secret );
		} catch ( Exception $exception ) {
			return $this->return_error( $exception->getMessage() );
		}

		$account  = $this->connection_manager->get_account_details();
		$response = $this->sanitize_for_javascript( $this->response_map, $account );

		return $this->return_success( $response );
	}

	/**
	 * ISU login: Retrieves clientId and clientSecret using a sharedId and authCode.
	 *
	 * This is the final step in the UI-driven login via the ISU popup, which
	 * is triggered by the LoginLinkRestEndpoint URL.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function connect_isu( WP_REST_Request $request ) : WP_REST_Response {
		$shared_id   = $request->get_param( 'sharedId' );
		$auth_code   = $request->get_param( 'authCode' );
		$use_sandbox = $request->get_param( 'useSandbox' );

		try {
			$this->connection_manager->validate_id_and_auth_code( $shared_id, $auth_code );
			$this->connection_manager->connect_via_auth_code( $use_sandbox, $shared_id, $auth_code );
		} catch ( Exception $exception ) {
			return $this->return_error( $exception->getMessage() );
		}

		$account  = $this->connection_manager->get_account_details();
		$response = $this->sanitize_for_javascript( $this->response_map, $account );

		return $this->return_success( $response );
	}
}
