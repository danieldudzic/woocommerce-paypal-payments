<?php
/**
 * The PHP-Scoper configuration.
 *
 * @package WooCommerce\PayPalCommerce
 */

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

return array(
	'prefix'             => 'WooCommerce\\PayPalCommerce\\Vendor',
	'finders'            => array(
		// Include only the Psr\Log package for scoping.
		Finder::create()
			->files()
			->in( __DIR__ . '/vendor/psr/log' ),

		// Exclude all other project files from scoping.
		Finder::create()
			->files()
			->in( __DIR__ )
			->exclude( 'vendor' ),
	),
	'expose-classes'     => array(
		// Expose all project namespaces to prevent scoping.
		'*',
	),
	'exclude-namespaces' => array(
		// Do not exclude any namespace to allow Psr\Log to be scoped.
	),
	'exclude-files'      => array(
		// Optionally exclude specific files, if required.
	),
	'patchers'           => array(),
);
