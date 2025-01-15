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
		// Only scope the psr/log package.
		Finder::create()
			->files()
			->in(__DIR__ . '/vendor/psr/log'),
	),
	'exclude-namespaces' => array(
		// Do not scope any other namespaces.
		'WooCommerce\\PayPalCommerce\\*',
	),
	'exclude-files'      => array(
		// Explicitly exclude the root files or any other files that should not be scoped.
		__DIR__ . '/*.php',
	),
	'patchers'           => array(),
);
