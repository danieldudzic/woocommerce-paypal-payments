/**
 * Selectors: Extract specific pieces of state from the store.
 *
 * These functions provide a consistent interface for accessing store data.
 * They allow components to retrieve data without knowing the store structure.
 *
 * @file
 */

const EMPTY_OBJ = Object.freeze( {} );

const getState = ( state ) => state || EMPTY_OBJ;

export const persistentData = ( state ) => {
	return getState( state ).data || EMPTY_OBJ;
};

export const transientData = ( state ) => {
	const { data, flags, ...transientState } = getState( state );
	return transientState || EMPTY_OBJ;
};

export const flags = ( state ) => {
	return getState( state ).flags || EMPTY_OBJ;
};

/**
 * Returns details about products and capabilities to use for the production login link in
 * the last onboarding step.
 *
 * This selector does not return state-values, but uses the state to derive the products-array
 * that should be returned.
 *
 * @param {{}} state
 * @return {string[]} The ISU products, based on choices made in the onboarding wizard.
 */
export const determineProductsAndCaps = ( state ) => {
	/**
	 * An array of product-names that are used to build an onboarding URL via the
	 * PartnerReferrals API.
	 */
	const products = [];

	/**
	 * Internal options that are parsed by the PartnerReferrals class to customize
	 * the API payload.
	 */
	const options = {};

	const { isCasualSeller, areOptionalPaymentMethodsEnabled } =
		persistentData( state );
	const { canUseVaulting, canUseCardPayments } = flags( state );

	if ( ! canUseCardPayments || ! areOptionalPaymentMethodsEnabled ) {
		/**
		 * Branch 1: Credit Card Payments not available.
		 * The store uses the Express-checkout product.
		 */
		products.push( 'EXPRESS_CHECKOUT' );
	} else if ( isCasualSeller ) {
		/**
		 * Branch 2: Merchant has no business.
		 * The store uses the Express-checkout product.
		 */
		products.push( 'EXPRESS_CHECKOUT' );
	} else {
		/**
		 * Branch 3: Merchant is business, and can use CC payments.
		 * The store uses the advanced PPCP product.
		 */
		products.push( 'PPCP' );
	}

	if ( canUseVaulting ) {
		products.push( 'ADVANCED_VAULTING' );
	}

	return { products, options };
};
