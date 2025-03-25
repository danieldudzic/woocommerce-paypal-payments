<?php
/**
 * Provides loading screen handling logic for PayPal settings page.
 *
 * @package WooCommerce\PayPalCommerce\Settings\Service
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Settings\Service;

/**
 * LoadingScreenService class. Handles the display of loading screen for the PayPal settings page.
 */
class LoadingScreenService {

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register(): void {
		if ( ! is_admin() ) {
			return;
		}

		add_action(
			'admin_head',
			array( $this, 'add_settings_loading_screen' )
		);
	}

	/**
	 * Add CSS to permanently hide specific WooCommerce elements on the PayPal settings page.
	 *
	 * @return void
	 */
	public function add_settings_loading_screen(): void {
		// Only run on the specific WooCommerce PayPal settings page.
		if ( ! $this->is_ppcp_settings_page() ) {
			return;
		}

		?>
		<style>
			/* Permanently hide these WooCommerce elements. */
			.woocommerce form#mainform > *:not(#ppcp-settings-container),
			#woocommerce-embedded-root {
				display: none;
			}

			#wpcontent #wpbody {
				margin-top: 0;
			}
		</style>
		<?php
	}

	/**
	 * Check if we're on the PayPal checkout settings page.
	 *
	 * @return bool True if we're on the PayPal settings page
	 */
	private function is_ppcp_settings_page(): bool {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		// The sanitize_get_param method handles unslashing and sanitization internally.
		$page    = $this->sanitize_get_param( $_GET['page'] ?? '' );
		$tab     = $this->sanitize_get_param( $_GET['tab'] ?? '' );
		$section = $this->sanitize_get_param( $_GET['section'] ?? '' );
		// phpcs:enable WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		// phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		return $page === 'wc-settings' && $tab === 'checkout' && $section === 'ppcp-gateway';
	}

	/**
	 * Sanitizes a GET parameter that could be string or array.
	 *
	 * @param mixed $param The parameter to sanitize.
	 * @return string The sanitized parameter.
	 */
	private function sanitize_get_param( $param ): string {
		if ( is_array( $param ) ) {
			return '';
		}
		return sanitize_text_field( wp_unslash( $param ) );
	}
}
