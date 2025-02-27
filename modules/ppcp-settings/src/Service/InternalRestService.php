<?php
/**
 * Service that allows calling internal REST endpoints from server-side.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Service;

use Throwable;
use Psr\Log\LoggerInterface;

class InternalRestService {

	/**
	 * Logger instance.
	 *
	 * In this case, the logger is quite important for debugging, because the main
	 * functionality of this class cannot be step-debugged using Xdebug: While
	 * a Xdebug session is active, the remote call to the current server is also
	 * blocked and will end in a timeout.
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * Constructor.
	 *
	 * @param LoggerInterface $logger Logger instance.
	 */
	public function __construct( LoggerInterface $logger ) {
		$this->logger = $logger;
	}

	public function get_data( string $endpoint ) : array {
		$token    = $this->generate_token( $endpoint );
		$rest_url = rest_url( $endpoint );

		$response = wp_remote_get(
		$this->logger->info( "Calling internal REST endpoint: $rest_url" );

		$response = wp_remote_request(
			$rest_url,
			array(
				'method'  => 'GET',
				'headers' => array(
					'X-Internal-Token' => $token,
					'Content-Type'     => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			$this->logger->error( 'Internal REST error', array( 'response' => $response ) );

			return array();
		}

		$body = wp_remote_retrieve_body( $response );

		try {
			$json = json_decode( $body, true, 512, JSON_THROW_ON_ERROR );
		} catch ( Throwable $exception ) {
			$this->logger->error(
				'Internal REST error: Invalid JSON response',
				array(
					'error'         => $exception->getMessage(),
					'response_body' => $body,
				)
			);

			return array();
		}

		if ( ! $json || empty( $json['success'] ) ) {
			$this->logger->error( 'Internal REST error: Invalid response', array( 'json' => $json ) );

			return array();
		}

		$this->logger->info( 'Internal REST success', array( 'data' => $json['data'] ) );

		return $json['data'];
	}

	public function verify_token( string $token, string $endpoint ) : bool {
		$expected_token = $this->generate_token( $endpoint );

		return $expected_token === $token;
	}

	private function generate_token( string $token_id ) : string {
		return base64_encode( $token_id );
	}
}
