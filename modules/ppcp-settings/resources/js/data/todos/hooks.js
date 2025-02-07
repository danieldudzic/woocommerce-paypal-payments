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
import { createHooksForStore } from '../utils';

const ensureArray = ( value ) => {
	if ( ! value ) {
		return [];
	}
	return Array.isArray( value ) ? value : Object.values( value );
};

const useHooks = () => {
	const { useTransient } = createHooksForStore( STORE_NAME );
	const { fetchTodos, setDismissedTodos, setCompletedTodos, persist } =
		useDispatch( STORE_NAME );

	// Read-only flags and derived state.
	const [ isReady ] = useTransient( 'isReady' );

	// Get todos data from store
	const { todos, dismissedTodos, completedTodos } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			todos: ensureArray( store.getTodos() ),
			dismissedTodos: ensureArray( store.getDismissedTodos() ),
			completedTodos: ensureArray( store.getCompletedTodos() ),
		};
	}, [] );

	const dismissedSet = new Set( dismissedTodos );

	const dismissTodo = async ( todoId ) => {
		if ( ! dismissedSet.has( todoId ) ) {
			const newDismissedTodos = [ ...dismissedTodos, todoId ];
			await setDismissedTodos( newDismissedTodos );
		}
	};

	const setTodoCompleted = async ( todoId, isCompleted ) => {
		let newCompletedTodos;
		if ( isCompleted ) {
			newCompletedTodos = [ ...completedTodos, todoId ];
		} else {
			newCompletedTodos = completedTodos.filter(
				( id ) => id !== todoId
			);
		}
		await setCompletedTodos( newCompletedTodos );
	};

	const filteredTodos = todos.filter(
		( todo ) => ! dismissedSet.has( todo.id )
	);

	return {
		persist,
		isReady,
		todos: filteredTodos,
		dismissedTodos,
		completedTodos,
		fetchTodos,
		dismissTodo,
		setTodoCompleted,
	};
};

export const useStore = () => {
	const { persist, isReady } = useHooks();
	return { persist, isReady };
};

export const useTodos = () => {
	const { todos, fetchTodos, dismissTodo, setTodoCompleted, isReady } =
		useHooks();
	return { todos, fetchTodos, dismissTodo, setTodoCompleted, isReady };
};

export const useDismissedTodos = () => {
	const { dismissedTodos } = useHooks();
	return { dismissedTodos };
};

export const useCompletedTodos = () => {
	const { completedTodos } = useHooks();
	return { completedTodos };
};
