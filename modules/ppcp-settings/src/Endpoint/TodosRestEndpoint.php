<?php
/**
 * REST endpoint to manage the things to do items.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Endpoint
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Settings\Endpoint;

use WP_REST_Response;
use WP_REST_Server;
use WooCommerce\PayPalCommerce\Settings\Data\TodosModel;
use WooCommerce\PayPalCommerce\Settings\Data\Definition\TodosDefinition;

/**
 * REST controller for the "Things To Do" items in the Overview tab.
 *
 * This API acts as the intermediary between the "external world" and our
 * internal data model. It's responsible for checking eligibility and
 * providing configuration data for things to do next.
 */
class TodosRestEndpoint extends RestEndpoint {
	/**
	 * The base path for this REST controller.
	 *
	 * @var string
	 */
	protected $rest_base = 'todos';

	/**
	 * The todos model instance.
	 *
	 * @var TodosModel
	 */
	protected TodosModel $todos;

	/**
	 * The todos definition instance.
	 *
	 * @var TodosDefinition
	 */
	protected TodosDefinition $todos_definition;

	/**
	 * Constructor.
	 *
	 * @param TodosModel      $todos            The todos model instance.
	 * @param TodosDefinition $todos_definition The todos definition instance.
	 */
	public function __construct(
		TodosModel $todos,
		TodosDefinition $todos_definition
	) {
		$this->todos            = $todos;
		$this->todos_definition = $todos_definition;
	}

	/**
	 * Configure REST API routes.
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_todos' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	/**
	 * Returns all eligible todo items.
	 *
	 * @return WP_REST_Response The response containing eligible todo items.
	 */
	public function get_todos(): WP_REST_Response {
		$completion_states = $this->todos->get();
		$todos             = array();

		foreach ( $this->todos_definition->get() as $id => $todo ) {
			if ( $todo['isEligible']() ) {
				$todos[] = array_merge(
					array(
						'id'          => $id,
						'isCompleted' => $completion_states[ $id ] ?? false,
					),
					array_diff_key( $todo, array( 'isEligible' => true ) )
				);
			}
		}

		return $this->return_success( $todos );
	}
}
