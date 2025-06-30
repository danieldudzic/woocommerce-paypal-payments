<?php
/**
 * The billing agreements endpoint.
 *
 * @package WooCommerce\PayPalCommerce\ApiClient\Endpoint
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\ApiClient\Helper;

use Psr\Log\LoggerInterface;
use WooCommerce\PayPalCommerce\ApiClient\Endpoint\PartnersEndpoint;
use WooCommerce\PayPalCommerce\ApiClient\Exception\RuntimeException;

class ReferenceTransactionStatus {

	protected PartnersEndpoint $partners_endpoint;

	public function __construct( PartnersEndpoint $partners_endpoint ) {
		$this->partners_endpoint = $partners_endpoint;
	}

	/**
	 * Checks if reference transactions are enabled in account.
	 *
	 * @throws RuntimeException If the request fails (no auth, no connection, etc.).
	 */
	public function reference_transaction_enabled(): bool {
		try {
			foreach ( $this->partners_endpoint->seller_status()->capabilities() as $capability ) {
				if (
					$capability->name() === 'PAYPAL_WALLET_VAULTING_ADVANCED' &&
					$capability->status() === 'ACTIVE'
				) {
					return true;
				}
			}
		} catch ( RuntimeException $exception ) {
			return false;
		}

		return false;
	}
}
