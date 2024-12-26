import { __, sprintf } from '@wordpress/i18n';

const SendOnlyMessage = () => {
	const settingsPageUrl = '/wp-admin/admin.php?page=wc-settings';

	const message = sprintf(
		/* translators: 1: URL to the WooCommerce store location settings */
		__(
			'Your current <a href="%1$s">WooCommerce store location</a> is in a "send-only" country, according to PayPal\'s policies. Sellers in these countries are unable to receive payments via PayPal. Since receiving payments is essential for using the PayPal Payments extension, you will not be able to connect your PayPal account while operating from a "send-only" country. To activate PayPal, please update your <a href="%1$s">WooCommerce store location</a> to a supported region and connect a PayPal account eligible for receiving payments.',
			'woocommerce-paypal-payments'
		),
		settingsPageUrl
	);

	return <p dangerouslySetInnerHTML={ { __html: message } } />;
};

export default SendOnlyMessage;
