<?php
/**
 * REST endpoint to manage the styling page.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Endpoint
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\Endpoint;

use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;
use WooCommerce\PayPalCommerce\Settings\Data\StylingSettings;
use WooCommerce\PayPalCommerce\Settings\DTO\LocationStylingDTO;

/**
 * REST controller for the "Styling" settings tab.
 *
 * This API acts as the intermediary between the "external world" and our
 * internal data model.
 */
class StylingRestEndpoint extends RestEndpoint {
	/**
	 * The base path for this REST controller.
	 *
	 * @var string
	 */
	protected $rest_base = 'styling';

	/**
	 * The settings instance.
	 *
	 * @var StylingSettings
	 */
	protected StylingSettings $settings;

	/**
	 * Field mapping for request to profile transformation.
	 *
	 * @var array
	 */
	private array $field_map = array(
		'cart'             => array(
			'js_name' => 'cart',
		),
		'classic_checkout' => array(
			'js_name' => 'classicCheckout',
		),
		'express_checkout' => array(
			'js_name' => 'expressCheckout',
		),
		'mini_cart'        => array(
			'js_name' => 'miniCart',
		),
		'product'          => array(
			'js_name' => 'product',
		),
	);

	/**
	 * Constructor.
	 *
	 * @param StylingSettings $settings The settings instance.
	 */
	public function __construct( StylingSettings $settings ) {
		$this->settings = $settings;

		$this->field_map['cart']['sanitize']             = array( $this, 'to_location' );
		$this->field_map['classic_checkout']['sanitize'] = array( $this, 'to_location' );
		$this->field_map['express_checkout']['sanitize'] = array( $this, 'to_location' );
		$this->field_map['mini_cart']['sanitize']        = array( $this, 'to_location' );
		$this->field_map['product']['sanitize']          = array( $this, 'to_location' );
	}

	/**
	 * Configure REST API routes.
	 */
	public function register_routes() : void {
		/**
		 * GET wc/v3/wc_paypal/styling
		 */
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_details' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		/**
		 * POST wc/v3/wc_paypal/styling
		 * {
		 *     // Fields mentioned in $field_map[]['js_name']
		 * }
		 */
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_details' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	/**
	 * Returns all styling details.
	 *
	 * @return WP_REST_Response The current styling details.
	 */
	public function get_details() : WP_REST_Response {
		$js_data = $this->sanitize_for_javascript(
			$this->settings->to_array(),
			$this->field_map
		);

		return $this->return_success(
			$js_data
		);
	}

	/**
	 * Updates styling details based on the request.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response The updated styling details.
	 */
	public function update_details( WP_REST_Request $request ) : WP_REST_Response {
		$wp_data = $this->sanitize_for_wordpress(
			$request->get_params(),
			$this->field_map
		);

		$this->settings->from_array( $wp_data );
		$this->settings->save();

		return $this->get_details();
	}

	/**
	 * Converts the plain location-style input to a structured DTO.
	 *
	 * @param array  $data Raw data received from the request.
	 * @param string $key  The field name.
	 *
	 * @return LocationStylingDTO
	 */
	protected function to_location( array $data, string $key ) : LocationStylingDTO {
		$is_enabled = ! isset( $data['enabled'] ) || $data['enabled'];
		$methods    = array();
		$shape      = sanitize_text_field( $data['shape'] ?? 'rect' );
		$label      = sanitize_text_field( $data['label'] ?? 'pay' );
		$color      = sanitize_text_field( $data['color'] ?? 'gold' );
		$layout     = sanitize_text_field( $data['layout'] ?? 'vertical' );
		$tagline    = isset( $data['tagline'] ) && $data['tagline'];

		if ( isset( $data['methods'] ) && is_array( $data['methods'] ) ) {
			$methods = array_map( 'sanitize_text_field', $data['methods'] );
		}

		return new LocationStylingDTO(
			$key,
			$is_enabled,
			$methods,
			$shape,
			$label,
			$color,
			$layout,
			$tagline,
		);
	}
}
