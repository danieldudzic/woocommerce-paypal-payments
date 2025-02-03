import { __ } from '@wordpress/i18n';
import PricingTitleBadge from '../../../../ReusableComponents/PricingTitleBadge';
import BadgeBox from '../../../../ReusableComponents/BadgeBox';

const DigitalWallets = () => (
	<BadgeBox
		title={ __( 'Digital Wallets', 'woocommerce-paypal-payments' ) }
		imageBadge={ [
			'icon-button-apple-pay.svg',
			'icon-button-google-pay.svg',
		] }
		textBadge={ <PricingTitleBadge item="dw" /> }
		description={ __(
			'Accept Apple Pay on eligible devices and Google Pay through mobile and web.',
			'woocommerce-paypal-payments'
		) }
		learnMoreLink={
			'https://www.paypal.com/us/business/paypal-business-fees'
		}
	/>
);

export default DigitalWallets;
