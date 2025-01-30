/**
 * Hooks: Provide the main API for components to interact with the store.
 *
 * These encapsulate store interactions, offering a consistent interface.
 * Hooks simplify data access and manipulation for components.
 *
 * @file
 */

import { useSelect, useDispatch } from '@wordpress/data';
import { STORE_NAME } from './constants';

const useTransient = ( key ) =>
	useSelect(
		( select ) => select( STORE_NAME ).transientData()?.[ key ],
		[ key ]
	);

export const useTodos = () => {
	const todos = useSelect(
		( select ) => select( STORE_NAME ).getTodos(),
		[]
	);
	// Convert to array if we get an object
	const dismissedTodos = useSelect( ( select ) => {
		const dismissed = select( STORE_NAME ).getDismissedTodos() || [];
		return Array.isArray( dismissed )
			? dismissed
			: Object.values( dismissed );
	}, [] );
	const isReady = useTransient( 'isReady' );

	const { fetchTodos, setDismissedTodos } = useDispatch( STORE_NAME );

	const dismissTodo = ( todoId ) => {
		const currentDismissed = dismissedTodos || [];
		if ( ! currentDismissed.includes( todoId ) ) {
			const newDismissedTodos = [ ...currentDismissed, todoId ];
			setDismissedTodos( newDismissedTodos );
		}
	};

	const filteredTodos = todos.filter(
		( todo ) => ! dismissedTodos.includes( todo.id )
	);

	return {
		todos: filteredTodos,
		isReady,
		fetchTodos,
		dismissTodo,
	};
};
