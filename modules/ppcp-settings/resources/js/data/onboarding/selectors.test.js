import '@testing-library/jest-dom';

import { determineProductsAndCaps } from './selectors';

describe( 'determineProductsAndCaps selector [casual seller]', () => {
	const testCases = [
		{
			name: 'should return EXPRESS_CHECKOUT when card payments are not available',
			state: {
				data: {
					isCasualSeller: true,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: false, canUseVaulting: false },
			},
			expected: [ 'EXPRESS_CHECKOUT' ],
		},
		{
			name: 'should return EXPRESS_CHECKOUT when optional payment methods are disabled',
			state: {
				data: {
					isCasualSeller: true,
					areOptionalPaymentMethodsEnabled: false,
				},
				flags: { canUseCardPayments: true, canUseVaulting: false },
			},
			expected: [ 'EXPRESS_CHECKOUT' ],
		},
		{
			name: 'should return EXPRESS_CHECKOUT for casual sellers with card payments',
			state: {
				data: {
					isCasualSeller: true,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: true, canUseVaulting: false },
			},
			expected: [ 'EXPRESS_CHECKOUT' ],
		},
		{
			name: 'should return EXPRESS_CHECKOUT and ADVANCED_VAULTING when card payments are not available but vaulting is',
			state: {
				data: {
					isCasualSeller: true,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: false, canUseVaulting: true },
			},
			expected: [ 'EXPRESS_CHECKOUT', 'ADVANCED_VAULTING' ],
		},
	];

	it.each( testCases )( '$name', ( { state, expected } ) => {
		const result = determineProductsAndCaps( state );
		expect( result ).toEqual( expected );
	} );
} );

describe( 'determineProductsAndCaps selector [business seller]', () => {
	const testCases = [
		{
			name: 'should return EXPRESS_CHECKOUT when card payments are not available',
			state: {
				data: {
					isCasualSeller: false,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: false, canUseVaulting: false },
			},
			expected: [ 'EXPRESS_CHECKOUT' ],
		},
		{
			name: 'should return EXPRESS_CHECKOUT when optional payment methods are disabled',
			state: {
				data: {
					isCasualSeller: false,
					areOptionalPaymentMethodsEnabled: false,
				},
				flags: { canUseCardPayments: true, canUseVaulting: false },
			},
			expected: [ 'EXPRESS_CHECKOUT' ],
		},
		{
			name: 'should return PPCP for business merchants with card payments',
			state: {
				data: {
					isCasualSeller: false,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: true, canUseVaulting: false },
			},
			expected: [ 'PPCP' ],
		},
		{
			name: 'should include ADVANCED_VAULTING when vaulting is available',
			state: {
				data: {
					isCasualSeller: false,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: true, canUseVaulting: true },
			},
			expected: [ 'PPCP', 'ADVANCED_VAULTING' ],
		},
		{
			name: 'should return EXPRESS_CHECKOUT and ADVANCED_VAULTING when card payments are not available but vaulting is',
			state: {
				data: {
					isCasualSeller: false,
					areOptionalPaymentMethodsEnabled: true,
				},
				flags: { canUseCardPayments: false, canUseVaulting: true },
			},
			expected: [ 'EXPRESS_CHECKOUT', 'ADVANCED_VAULTING' ],
		},
	];

	it.each( testCases )( '$name', ( { state, expected } ) => {
		const result = determineProductsAndCaps( state );
		expect( result ).toEqual( expected );
	} );
} );
