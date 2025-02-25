import { Icon } from '@wordpress/components';
import { warning } from '@wordpress/icons';

/**
 * Component to display a warning message for payment methods
 *
 * @param {Object} props                - Component props
 * @param {string} props.warningMessage - The warning message to display
 * @return {JSX.Element} The formatted warning message with icon
 */
const WarningMessage = ( { warningMessage } ) => {
	return (
		<span className="ppcp--method-warning">
			<Icon icon={ warning } />
			<div
				className="ppcp--method-warning-message"
				dangerouslySetInnerHTML={ { __html: warningMessage } }
			/>
		</span>
	);
};

export default WarningMessage;
