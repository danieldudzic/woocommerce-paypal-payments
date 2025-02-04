/**
 * Action Creators: Define functions to create action objects.
 *
 * These functions update state or trigger side effects (e.g., async operations).
 * Actions are categorized as Transient, Persistent, or Side effect.
 *
 * @file
 */

import { select } from '@wordpress/data';
import ACTION_TYPES from './action-types';
import { STORE_NAME } from './constants';

export const setIsReady = ( isReady ) => ( {
	type: ACTION_TYPES.SET_TRANSIENT,
	payload: { isReady },
} );

export const setTodos = ( todos ) => ( {
	type: ACTION_TYPES.SET_TODOS,
	payload: todos,
} );

export const setDismissedTodos = ( dismissedTodos ) => ( {
	type: ACTION_TYPES.SET_DISMISSED_TODOS,
	payload: dismissedTodos,
} );

export const fetchTodos = function* () {
	yield { type: ACTION_TYPES.DO_FETCH_TODOS };
};

export const persist = function* () {
	const data = yield select( STORE_NAME ).persistentData();
	yield { type: ACTION_TYPES.DO_PERSIST_DATA, data };
};

export const resetDismissedTodos = function* () {
	const result = yield { type: ACTION_TYPES.DO_RESET_DISMISSED_TODOS };

	if ( result && result.success ) {
		// After successful reset, fetch fresh todos
		yield fetchTodos();
	}

	return result;
};

export const setCompletedTodos = ( completedTodos ) => ( {
	type: ACTION_TYPES.SET_COMPLETED_TODOS,
	payload: completedTodos,
} );
