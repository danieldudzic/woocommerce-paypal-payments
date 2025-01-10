<?php

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce;

// phpcs:disable PSR1.Files.SideEffects

use Isolated\Symfony\Component\Finder\Finder;

function getWpExcludedSymbols(string $fileName): array
{
	$composerHome = (string) getenv('COMPOSER_HOME');

	$filePath = $composerHome . '/vendor/sniccowp/php-scoper-wordpress-excludes/generated/' . $fileName;

	$fileContents = file_get_contents($filePath);
	if ($fileContents === false) {
		return [];
	}

	/**
	 * @var array $decodedEntries
	 */
	$decodedEntries = json_decode(
		$fileContents,
		true,
	);

	return $decodedEntries;
}

$wpConstants = getWpExcludedSymbols('exclude-wordpress-constants.json');
$wpClasses = getWpExcludedSymbols('exclude-wordpress-classes.json');
$wpFunctions = getWpExcludedSymbols('exclude-wordpress-functions.json');

$finders = [
	Finder::create()
		->files()
		->ignoreVCS(true)
		->ignoreDotFiles(false) # We need to keep .distignore around
		->exclude([
			'.idea',
			'.github',
			'.ddev',
			'.phan',
			'bin',
			'tests',
			'vendor/amphp',
		])
		->in('.'),
];

return [
	'prefix' => 'WooCommerce\PayPalCommerce\Vendor',
	'finders' => $finders, // list<Finder>
	'patchers' => [],
	'exclude-files' => [],
	'exclude-namespaces' => [
		'^WooCommerce',
		'Automattic',
		'Composer',
		'Inpsyde\Assets',
		'WooCommerce\PayPalCommerce',
	], // list<string|regex>
	'exclude-constants' => array_merge($wpConstants, [
		'FS_METHOD',
		'HHVM_VERSION',
		'WC_VERSION',
	]), // list<string|regex>
	'exclude-classes' => array_merge($wpClasses, [
		'WooCommerce',
		'WP_CLI',
		'/^WC_/',
	]), // list<string|regex>
	'exclude-functions' => array_merge($wpFunctions, [
		'/^wc/',
	]), // list<string|regex>

	'expose-global-constants' => false, // bool
	'expose-global-classes' => false, // bool
	'expose-global-functions' => false, // bool

	'expose-namespaces' => [], // list<string|regex>
	'expose-constants' => [], // list<string|regex>
	'expose-classes' => [], // list<string|regex>
	'expose-functions' => [], // list<string|regex>
];
