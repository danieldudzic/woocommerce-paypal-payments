/**
 * Selectors: Extract specific pieces of state from the store.
 *
 * These functions provide a consistent interface for accessing store data.
 * They allow components to retrieve data without knowing the store structure.
 *
 * @file
 */

const EMPTY_OBJ = Object.freeze( {} );
const EMPTY_ARR = Object.freeze( [] );

const getState = ( state ) => state || EMPTY_OBJ;

export const persistentData = ( state ) => {
	return getState( state ).data || EMPTY_OBJ;
};

export const transientData = ( state ) => {
	const { data, ...transientState } = getState( state );
	return transientState || EMPTY_OBJ;
};

export const getTodos = ( state ) => {
	const todos = state?.todos || persistentData( state ).todos;
	return todos || EMPTY_ARR;
};

export const getDismissedTodos = ( state ) => {
	const dismissed =
		state?.dismissedTodos || persistentData( state ).dismissedTodos;
	return dismissed || EMPTY_ARR;
};

export const getCompletedTodos = ( state ) => {
	return state?.completedTodos || EMPTY_ARR; // Only look at root state, not persistent data
};
