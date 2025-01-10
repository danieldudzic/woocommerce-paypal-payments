import { __ } from '@wordpress/i18n';

import TabOverview from '../../Overview/TabOverview';
import TabPaymentMethods from '../../Overview/TabPaymentMethods';
import TabSettings from '../../Overview/TabSettings';
import TabStyling from '../../Overview/TabStyling';

/**
 * List of all default settings tabs.
 *
 * The tabs are displayed in the order in which they appear in this array
 *
 * @type {[{name, title, Component}]}
 */
const DEFAULT_TABS = [
	{
		name: 'overview',
		title: __( 'Overview', 'woocommerce-paypal-payments' ),
		Component: <TabOverview />,
	},
	{
		name: 'payment-methods',
		title: __( 'Payment Methods', 'woocommerce-paypal-payments' ),
		Component: <TabPaymentMethods />,
	},
	{
		name: 'settings',
		title: __( 'Settings', 'woocommerce-paypal-payments' ),
		Component: <TabSettings />,
	},
	{
		name: 'styling',
		title: __( 'Styling', 'woocommerce-paypal-payments' ),
		Component: <TabStyling />,
	},
];

export const getSettingsTabs = () => {
	return DEFAULT_TABS;
};
