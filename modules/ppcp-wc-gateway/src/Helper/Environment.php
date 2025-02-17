<?php
/**
 * Describes the current API environment (production or sandbox).
 *
 * @package WooCommerce\PayPalCommerce\WcGateway\Helper
 */

declare( strict_types = 1 );

namespace WooCommerce\PayPalCommerce\WcGateway\Helper;

/**
 * Class Environment
 */
class Environment {

	/**
	 * Name of the production environment.
	 */
	public const PRODUCTION = 'production';

	/**
	 * Name of the sandbox environment.
	 */
	public const SANDBOX = 'sandbox';

	/**
	 * Name of the current environment.
	 *
	 * @var string
	 */
	private string $environment_name = '';

	/**
	 * Environment constructor.
	 *
	 * @param bool $is_sandbox Whether this instance represents a sandbox environment.
	 */
	public function __construct( bool $is_sandbox = false ) {
		$this->set_environment( $is_sandbox );
	}

	/**
	 * Sets the current environment.
	 *
	 * @param bool $is_sandbox Whether this instance represents a sandbox environment.
	 */
	private function set_environment( bool $is_sandbox ) : void {
		if ( $is_sandbox ) {
			$this->environment_name = self::SANDBOX;
		} else {
			$this->environment_name = self::PRODUCTION;
		}
	}

	/**
	 * Returns the current environment's name.
	 *
	 * @return string
	 */
	public function current_environment() : string {
		return $this->environment_name;
	}

	/**
	 * Detect whether the current environment equals $environment
	 *
	 * @deprecated Use the is_sandbox() and is_production() methods instead.
	 *             These methods provide better encapsulation, are less error-prone,
	 *             and improve code readability by removing the need to pass environment constants.
	 * @param string $environment The value to check against.
	 *
	 * @return bool
	 */
	public function current_environment_is( string $environment ) : bool {
		return $this->current_environment() === $environment;
	}

	/**
	 * Returns whether the current environment is sandbox.
	 *
	 * @return bool
	 */
	public function is_sandbox() : bool {
		return $this->current_environment() === self::SANDBOX;
	}

	/**
	 * Returns whether the current environment is production.
	 *
	 * @return bool
	 */
	public function is_production() : bool {
		return $this->current_environment() === self::PRODUCTION;
	}
}
