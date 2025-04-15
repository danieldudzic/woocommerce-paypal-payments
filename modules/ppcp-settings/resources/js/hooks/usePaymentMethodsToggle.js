import { useState, useEffect, useCallback } from '@wordpress/element';

/**
 * Custom hook to manage bulk toggling of payment methods
 *
 * @param {Object}   options                       - Options for the hook
 * @param {Array}    options.methods               - List of payment methods to control
 * @param {Object}   options.methodsMap            - Map of all payment methods by ID
 * @param {Function} options.changePaymentSettings - Function to update payment settings
 * @param {Object}   options.paymentDependencies   - Payment method dependencies (optional)
 * @param {Object}   options.settingDependencies   - Setting dependencies (optional)
 * @param {Array}    options.additionalDeps        - Additional dependencies to trigger recalculation (optional)
 * @return {Object} Toggle state and handlers
 */
const usePaymentMethodsToggle = ( {
	methods = [],
	methodsMap = {},
	changePaymentSettings,
	paymentDependencies = {},
	settingDependencies = {},
	additionalDeps = [],
} ) => {
	const [ allEnabled, setAllEnabled ] = useState( false );
	const [ availableMethods, setAvailableMethods ] = useState( [] );
	useEffect( () => {
		if ( ! methods || methods.length === 0 ) {
			setAllEnabled( false );
			setAvailableMethods( [] );
			return;
		}

		const available = methods.filter( ( method ) => {
			if ( ! method || ! method.id ) {
				return false;
			}

			const hasPaymentDependency =
				paymentDependencies && paymentDependencies[ method.id ];

			const hasSettingDependency =
				settingDependencies && settingDependencies[ method.id ];

			if (
				hasPaymentDependency ||
				hasSettingDependency ||
				method.isDisabled
			) {
				return false;
			}

			return true;
		} );

		setAvailableMethods( available );

		const areAllEnabled =
			available.length > 0 &&
			available.every( ( method ) => method.enabled === true );

		setAllEnabled( areAllEnabled );
	}, [
		methods,
		methodsMap,
		paymentDependencies,
		settingDependencies,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		...additionalDeps,
	] );

	const toggleAllMethods = useCallback( () => {
		if ( ! availableMethods.length || ! changePaymentSettings ) {
			return;
		}

		// Determine the new state - if all are enabled, disable them, otherwise enable all
		const newState = ! allEnabled;

		availableMethods.forEach( ( method ) => {
			changePaymentSettings( method.id, {
				enabled: newState,
			} );
		} );
	}, [ availableMethods, changePaymentSettings, allEnabled ] );

	return {
		allEnabled,
		toggleAllMethods,
		availableMethods,
		methodCount: availableMethods.length,
	};
};

export default usePaymentMethodsToggle;
