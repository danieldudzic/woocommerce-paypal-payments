<?php
declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Settings\Endpoint;

use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;

class CompleteOnClickEndpoint extends RestEndpoint {
	protected $rest_base = 'complete-onclick';

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'complete_onclick' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	public function complete_onclick( WP_REST_Request $request ): WP_REST_Response {
		$todo_id = $request->get_param( 'todoId' );

		if ( ! $todo_id ) {
			return $this->return_error( __( 'Todo ID is required.', 'woocommerce-paypal-payments' ) );
		}

		$settings = get_option( 'ppcp-settings', array() );

		if ( ! isset( $settings['completedOnClickTodos'] ) ) {
			$settings['completedOnClickTodos'] = array();
		}

		if ( ! in_array( $todo_id, $settings['completedOnClickTodos'] ) ) {
			$settings['completedOnClickTodos'][] = $todo_id;
			$update_result                       = update_option( 'ppcp-settings', $settings );

			if ( ! $update_result ) {
				return $this->return_error( __( 'Failed to mark todo as completed on click.', 'woocommerce-paypal-payments' ) );
			}
		}

		return $this->return_success(
			array(
				'message' => __( 'Todo marked as completed on click successfully.', 'woocommerce-paypal-payments' ),
				'todoId'  => $todo_id,
			)
		);
	}
}
