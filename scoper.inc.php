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
		// Include the psr/log package specifically.
		Finder::create()
			->files()
			->in( __DIR__ . '/vendor/psr/log' ),

		// Include all files from the project, excluding the vendor directory.
		Finder::create()
			->files()
			->in( __DIR__ )
			->exclude( 'vendor' ),
	),
	'whitelist'          => array(
		// Whitelist only the Psr\Log namespace.
		'Psr\\Log\\*',
	),
	'exclude-namespaces' => array(
		// Exclude all namespaces except for Psr\Log globally.
		'WooCommerce\\PayPalCommerce\\*',
	),
	'exclude-files'      => array(
		// Optionally, list specific files you want to exclude here.
	),
	'patchers'           => array(),
);
