<?php
/**
 * The PHP-Scoper configuration.
 *
 * @package WooCommerce\PayPalCommerce
 */

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

return array(
	'prefix'                  => 'WooCommerce\\PayPalCommerce\\Vendor',
	'finders'                 => array(
		// Include only the Psr\Log package for scoping.
		Finder::create()
			->files()
			->in( __DIR__ . '/vendor/psr/log' ),
	),
	'exclude-files'           => array(
		// Exclude all files in the root directory explicitly.
		__DIR__ . '/*.php',
	),
	'expose-classes'          => array( '*' ), // Expose all classes outside `vendor/psr/log`.
	'expose-namespaces'       => array( '*' ), // Expose all namespaces except `Psr\Log`.
	'expose-global-constants' => true,
	'expose-global-functions' => true,
);
