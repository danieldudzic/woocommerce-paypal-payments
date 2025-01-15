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
			->exclude( array( 'vendor' ) ),
	),
	'exclude-classes'    => array(
		// Expose all project namespaces to prevent scoping.
		'*',
	),
	'exclude-namespaces' => array(
		'*',
	),
	'exclude-files'      => array(),
	'patchers'           => array(),
);
