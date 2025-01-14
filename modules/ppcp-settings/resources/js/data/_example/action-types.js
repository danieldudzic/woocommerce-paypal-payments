/**
 * Action Types: Define unique identifiers for actions across all store modules.
 *
 * @file
 */

export default {
	// Transient data.
	SET_TRANSIENT: '<UNKNOWN>:SET_TRANSIENT',

	// Persistent data.
	SET_PERSISTENT: '<UNKNOWN>:SET_PERSISTENT',
	RESET: '<UNKNOWN>:RESET',
	HYDRATE: '<UNKNOWN>:HYDRATE',

	// Controls - always start with "DO_".
	DO_PERSIST_DATA: '<UNKNOWN>:DO_PERSIST_DATA',
};
