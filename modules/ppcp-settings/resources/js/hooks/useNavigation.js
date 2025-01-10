/**
 * Navigate to the WooCommerce "Payments" settings tab, i.e. exit the settings app.
 */
const goToWooCommercePaymentsTab = () => {
	window.location.href = window.ppcpSettings.wcPaymentsTabUrl;
};

export const useNavigation = () => {
	return { goToWooCommercePaymentsTab };
};
