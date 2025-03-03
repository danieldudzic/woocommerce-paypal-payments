/**
 * Custom hook to handle payment-method-based payment method dependencies
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
	const dependencies = method.depends_on_payment_methods || [];

	if ( ! dependencies.length ) {
		return [];
	}

	const disabledParents = dependencies.filter( ( parentId ) => {
		const parent = methodsMap[ parentId ];
		return parent && ! parent.enabled;
	} );

	return disabledParents;
};

/**
 * Hook to evaluate payment method dependencies for a set of methods
 *
 * @param {Array}  methods    - List of payment methods
 * @param {Object} methodsMap - Map of payment methods by ID
 * @return {Object|null} Dependency state object keyed by method ID, or null if not ready
 */
const usePaymentDependencyState = ( methods, methodsMap ) => {
	const dependencyState = useSelect(
		( select ) => {
			const paymentStore = select( 'wc/paypal/payment' );
			if ( ! paymentStore ) {
				return null;
			}

			// Check if payment methods data is available
			if (
				! methods ||
				! methodsMap ||
				Object.keys( methodsMap ).length === 0
			) {
				return null;
			}

			const result = {};

			methods.forEach( ( method ) => {
				if ( ! method || ! method.id ) {
					return;
				}

				const disabledParents = findDisabledParents(
					method,
					methodsMap
				);

				if ( disabledParents.length > 0 ) {
					const parentId = disabledParents[ 0 ];
					const parentName = getParentMethodName(
						parentId,
						methodsMap
					);

					result[ method.id ] = {
						isDisabled: true,
						parentId,
						parentName,
					};
				}
			} );

			return result;
		},
		[ methods, methodsMap ]
	);

	return dependencyState;
};

export default usePaymentDependencyState;
