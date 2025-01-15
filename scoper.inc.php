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
		// Only include files from the psr/log package for scoping.
		Finder::create()
			->files()
			->in( __DIR__ . '/vendor/psr/log' ), // Only include the 'psr/log' directory.
	),
	'exclude-files'           => array(
		// Exclude all files in the root directory explicitly.
		__DIR__ . '/vendor/*', // Optionally, exclude other files you do not want to scope.
	),
	'expose-global-constants' => true,
	'expose-global-functions' => true,
);
