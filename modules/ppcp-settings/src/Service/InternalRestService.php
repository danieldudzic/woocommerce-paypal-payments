<?php
/**
 * Service that allows calling internal REST endpoints from server-side.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Service;

use Throwable;

class InternalRestService {
	public function get_data( string $endpoint ) : array {
		$token    = $this->generate_token( $endpoint );
		$rest_url = rest_url( $endpoint );

		$response = wp_remote_get(
			$rest_url,
			array(
				'headers' => array(
					'X-Internal-Token' => $token,
					'Content-Type'     => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return array();
		}

		$body = wp_remote_retrieve_body( $response );

		try {
			$json = json_decode( $body, true, 512, JSON_THROW_ON_ERROR );
		} catch ( Throwable $exception ) {
			return array();
		}

		if ( ! $json || empty( $json['success'] ) ) {
			return array();
		}

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
