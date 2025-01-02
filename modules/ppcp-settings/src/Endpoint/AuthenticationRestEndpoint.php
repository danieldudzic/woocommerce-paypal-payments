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
 * REST controller for connection to a PayPal merchant account.
 */
class AuthenticationRestEndpoint extends RestEndpoint {
	/**
	 * The base path for this REST controller.
	 *
	 * @var string
	 */
	protected $rest_base = 'authenticate';

	/**
	 * Field mapping for request.
	 *
	 * @var array
	 */
	private array $field_map = array(
		'client_id'     => array(
			'js_name'  => 'clientId',
			'sanitize' => 'sanitize_text_field',
		),
		'client_secret' => array(
			'js_name'  => 'clientSecret',
			'sanitize' => 'sanitize_text_field',
		),
		'use_sandbox'   => array(
			'js_name'  => 'useSandbox',
			'sanitize' => 'to_boolean',
		),
	);

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
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'connect_manual' ),
					'permission_callback' => array( $this, 'check_permission' ),
				),
			)
		);
	}

	/**
	 * Retrieves merchantId and email.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function connect_manual( WP_REST_Request $request ) : WP_REST_Response {
		$data = $this->sanitize_for_wordpress(
			$request->get_params(),
			$this->field_map
		);

		$client_id     = $data['client_id'] ?? '';
		$client_secret = $data['client_secret'] ?? '';
		$use_sandbox   = (bool) ( $data['use_sandbox'] ?? false );

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
}
