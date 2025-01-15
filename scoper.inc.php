<?php
/**
 * The PHP-Scoper configuration.
 *
 * @package WooCommerce\PayPalCommerce
 */

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

return array(
	'prefix'             => 'WooCommerce\PayPalCommerce\Vendor',
	'finders'            => array(
		// Include the psr/log package.
		Finder::create()
			->files()
			->in( 'vendor/psr/log' ),

		Finder::create()
			->files()
			->in( 'woocommerce-paypal-payments' )
			->exclude( 'vendor' ),
	),
	'whitelist'          => array(
		// Exclude all namespaces except for the ones in psr/log.
		'Psr\\Log\\*',
	),
	'exclude-namespaces' => array(
		// Exclude all namespaces globally except for Psr\Log.
		'WooCommerce\PayPalCommerce\\*',
	),
	'exclude-files'      => array(
		// Optionally exclude specific files if needed.
	),
	'patchers'           => array(),
);
