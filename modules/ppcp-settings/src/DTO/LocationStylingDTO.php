<?php
/**
 * Data transfer object. Stores styling details for a single location.
 *
 * @package WooCommerce\PayPalCommerce\Settings\DTO;
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\Settings\DTO;

/**
 * DTO that collects all styling details of a single location
 *
 * Intentionally has no internal logic, sanitation or validation.
 */
class LocationStylingDTO {
	/**
	 * The location name, e.g., card, block-checkout, ...
	 *
	 * @var string
	 */
	public string $location = '';

	/**
	 * Whether PayPal payments are enabled on this location.
	 *
	 * @var bool
	 */
	public bool $enabled = false;

	/**
	 * List of active payment methods, e.g., 'venmo', 'applepay', ...
	 *
	 * @var array
	 */
	public array $methods = array();

	/**
	 * Shape of buttons on this location.
	 *
	 * @var string [rect|pill]
	 */
	public string $shape = 'rect';

	/**
	 * Label of the button on this location.
	 *
	 * @var string
	 */
	public string $label = '';

	/**
	 * Color of the button on this location.
	 *
	 * @var string [gold|blue|silver|black|white]
	 */
	public string $color = 'gold';

	/**
	 * Constructor.
	 *
	 * @param string $location The location name.
	 * @param bool   $enabled  Whether PayPal payments are enabled on this location.
	 * @param array  $methods  List of active payment methods.
	 * @param string $shape    Shape of buttons on this location.
	 * @param string $label    Label of the button on this location.
	 * @param string $color    Color of the button on this location.
	 */
	public function __construct(
		string $location,
		bool $enabled,
		array $methods,
		string $shape,
		string $label,
		string $color
	) {
		$this->location = $location;
		$this->enabled  = $enabled;
		$this->methods  = $methods;
		$this->shape    = $shape;
		$this->label    = $label;
		$this->color    = $color;
	}
}
