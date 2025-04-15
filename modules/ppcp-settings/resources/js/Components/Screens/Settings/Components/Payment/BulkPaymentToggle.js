import { __, sprintf } from '@wordpress/i18n';

/**
 * Renders a link to enable/disable all payment methods in a group
 *
 * @param {Object}   props            - Component props
 * @param {boolean}  props.isEnabled  - Whether all methods are currently enabled
 * @param {Function} props.onToggle   - Callback when link is clicked
 * @param {string}   props.label      - Custom label for the link
 * @param {boolean}  props.isDisabled - Whether the link is disabled
 * @param {string}   props.groupName  - Name of the payment method group
 * @return {JSX.Element} The rendered component
 */
const BulkPaymentToggle = ( {
	isEnabled = false,
	onToggle,
	label = '',
	isDisabled = false,
	groupName = '',
} ) => {
	let displayLabel;

	if ( label ) {
		// Use provided label if available
		displayLabel = label;
	} else {
		const action = isEnabled
			? __( 'Disable', 'woocommerce-paypal-payments' )
			: __( 'Enable', 'woocommerce-paypal-payments' );

		/* translators: %s: payment method group name */
		const templateString = __(
			'all %s Methods',
			'woocommerce-paypal-payments'
		);

		displayLabel = sprintf(
			/* translators: %1$s: action (Enable/Disable), %2$s: formatted string with payment method group name */
			__( '%1$s %2$s', 'woocommerce-paypal-payments' ),
			action,
			sprintf( templateString, groupName )
		);
	}

	return (
		<div className="ppcp-bulk-action">
			{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
			<a
				href="#"
				className={ `ppcp-bulk-action__link ${
					isDisabled ? 'ppcp-bulk-action__link--disabled' : ''
				}` }
				onClick={ ( e ) => {
					e.preventDefault();
					if ( ! isDisabled ) {
						onToggle();
					}
				} }
				aria-disabled={ isDisabled }
				role={ 'button' }
			>
				{ displayLabel }
			</a>
		</div>
	);
};

export default BulkPaymentToggle;
