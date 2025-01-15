<?php
/**
 * The PHP-Scoper configuration.
 *
 * @package WooCommerce\PayPalCommerce
 */

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

$wp_classes   = array();
$wp_constants = array();
$wp_functions = array();

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
				'.psalm',
				'tests',
			)
		)
		->in( '.' ),
);

return array(
	'prefix'                  => 'WooCommerce\\PayPalCommerce\\Vendor',
	'finders'                 => $finders,
	'patchers'                => array(),
	'exclude-files'           => array(
		'vendor/symfony/polyfill-php80/Resources/stubs/Stringable.php',
	), // list<string>.
	'exclude-namespaces'      => array(
		'/^(?!Psr).*/',
	), // list<string|regex>.
	'exclude-constants'       => array_merge(
		$wp_constants,
		array(
			'WC_VERSION',
		)
	), // list<string|regex>.
	'exclude-classes'         => array_merge(
		$wp_classes,
		array(
			'WooCommerce',
			'/^WC_/',
		)
	),     // list<string|regex>.
	'exclude-functions'       => array_merge(
		$wp_functions,
		array(
			'/^wc/',
		)
	), // list<string|regex>.

	'expose-global-constants' => false,   // bool.
	'expose-global-classes'   => false,     // bool.
	'expose-global-functions' => false,   // bool.

	'expose-namespaces'       => array(), // list<string|regex>.
	'expose-constants'        => array(),  // list<string|regex>.
	'expose-classes'          => array(),    // list<string|regex>.
	'expose-functions'        => array(),  // list<string|regex>.
);
