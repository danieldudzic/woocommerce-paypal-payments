/**
 * Custom hook to handle payment-method-based dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Gets the display name for a parent payment method
 *
 * @param {string} parentId   - ID of the parent payment method
 * @param {Object} methodsMap - Map of all payment methods by ID
 * @return {string} The display name to use for the parent method
 */
const getParentMethodName = ( parentId, methodsMap ) => {
	const parentMethod = methodsMap[ parentId ];
	return parentMethod
		? parentMethod.itemTitle || parentMethod.title || ''
		: '';
};

/**
 * Finds disabled parent dependencies for a method
 *
 * @param {Object} method     - The payment method to check
 * @param {Object} methodsMap - Map of all payment methods by ID
 * @return {Array} List of disabled parent IDs, empty if none
 */
const findDisabledParents = ( method, methodsMap ) => {
	const dependencies = method.depends_on_payment_methods;

	if ( ! dependencies || ! Array.isArray( dependencies ) ) {
		return [];
	}

	return dependencies.filter( ( parentId ) => {
		const parent = methodsMap[ parentId ];
		return parent && ! parent.enabled;
	} );
};

/**
 * Hook to evaluate payment method dependencies
 *
 * @param {Array}  methods    - List of payment methods
 * @param {Object} methodsMap - Map of payment methods by ID
 * @return {Object} Dependency state object keyed by method ID
 */
const usePaymentDependencyState = ( methods, methodsMap ) => {
	return useSelect( () => {
		const result = {};

		if ( methods && methodsMap && Object.keys( methodsMap ).length > 0 ) {
			methods.forEach( ( method ) => {
				if ( method && method.id ) {
					const disabledParents = findDisabledParents(
						method,
						methodsMap
					);

					if ( disabledParents.length > 0 ) {
						const parentId = disabledParents[ 0 ];
						result[ method.id ] = {
							isDisabled: true,
							parentId,
							parentName: getParentMethodName(
								parentId,
								methodsMap
							),
						};
					}
				}
			} );
		}

		return result;
	}, [ methods, methodsMap ] );
};

export default usePaymentDependencyState;
