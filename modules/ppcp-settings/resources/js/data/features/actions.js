/**
 * Action Creators: Define functions to create action objects for features.
 *
 * These functions update state or trigger side effects (e.g., async operations).
 *
 * @file
 */

import apiFetch from '@wordpress/api-fetch';

import { REST_FEATURES_PATH } from './constants';

// Thunks

export function fetchFeatures() {
	return async () => {
		const response = await apiFetch( { path: REST_FEATURES_PATH } );
		return response?.data || [];
	};
}
