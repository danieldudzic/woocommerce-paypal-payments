/**
 * Navigate to the WooCommerce "Payments" settings tab, i.e. exit the settings app.
 */
const goToWooCommercePaymentsTab = () => {
	window.location.href = window.ppcpSettings.wcPaymentsTabUrl;
};

/**
 * Navigate to the main settings page, or to a defined tab (panel).
 * Always initiates a browser navigation - if the user already is on the defined settings page,
 * this function acts as a page-reload.
 *
 * @param {?string} [panel=null] Which settings tab to display.
 */
const goToPluginSettings = ( panel = null ) => {
	let url = window.ppcpSettings.pluginSettingsUrl;

	if ( panel ) {
		url += '&panel=' + panel;
	}

	window.location.href = url;
};

export const useNavigation = () => {
	return {
		goToWooCommercePaymentsTab,
		goToPluginSettings,
	};
};
