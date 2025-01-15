<?php
/**
 * The PHP-Scoper configuration.
 *
 * @package WooCommerce\PayPalCommerce
 */

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

$finders = array(
	Finder::create()
		->files()
		->ignoreVCS( true )
		->ignoreDotFiles( false ) // We need to keep .distignore around.
		->exclude(
			array(
				'.github',
				'.ddev',
				'.idea',
				'modules',
				'tests',
				'api',
				'lib',
				'src',
				'vendor',
			)
		)
		->in( '.' ),
);

return array(
	'prefix'                  => 'WooCommerce\\PayPalCommerce\\Vendor',
	'finders'                 => $finders,
	'patchers'                => array(),
	'exclude-namespaces'      => array(),
	'exclude-files'           => array(
		// Exclude all files in the root directory explicitly.
		__DIR__ . '/*.php',
	),
	'expose-global-constants' => true,
	'expose-global-functions' => true,
);
