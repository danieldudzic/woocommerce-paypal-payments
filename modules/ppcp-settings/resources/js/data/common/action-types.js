/**
 * Action Types: Define unique identifiers for actions across all store modules.
 *
 * @file
 */

export default {
	// Transient data.
	SET_TRANSIENT: 'ppcp/common/SET_TRANSIENT',

	// Persistent data.
	SET_PERSISTENT: 'ppcp/common/SET_PERSISTENT',
	RESET: 'ppcp/common/RESET',
	HYDRATE: 'ppcp/common/HYDRATE',

	// Activity management (advanced solution that replaces the isBusy state).
	START_ACTIVITY: 'ppcp/common/START_ACTIVITY',
	STOP_ACTIVITY: 'ppcp/common/STOP_ACTIVITY',

	// Controls - always start with "DO_".
	DO_PERSIST_DATA: 'ppcp/common/DO_PERSIST_DATA',
	DO_DIRECT_API_AUTHENTICATION: 'ppcp/common/DO_DIRECT_API_AUTHENTICATION',
	DO_OAUTH_AUTHENTICATION: 'ppcp/common/DO_OAUTH_AUTHENTICATION',
	DO_DISCONNECT_MERCHANT: 'ppcp/common/DO_DISCONNECT_MERCHANT',
	DO_GENERATE_ONBOARDING_URL: 'ppcp/common/DO_GENERATE_ONBOARDING_URL',
	DO_REFRESH_MERCHANT: 'ppcp/common/DO_REFRESH_MERCHANT',
	DO_REFRESH_FEATURES: 'ppcp/common/DO_REFRESH_FEATURES',
	DO_RESUBSCRIBE_WEBHOOKS: 'ppcp/common/DO_RESUBSCRIBE_WEBHOOKS',
	DO_START_WEBHOOK_SIMULATION: 'ppcp/common/DO_START_WEBHOOK_SIMULATION',
	DO_CHECK_WEBHOOK_SIMULATION: 'ppcp/common/DO_CHECK_WEBHOOK_SIMULATION',
};
