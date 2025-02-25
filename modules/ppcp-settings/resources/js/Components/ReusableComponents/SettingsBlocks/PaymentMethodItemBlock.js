import { ToggleControl, Icon, Button } from '@wordpress/components';
import { cog } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';
import { useActiveHighlight } from '../../../data/common/hooks';

import SettingsBlock from '../SettingsBlock';
import PaymentMethodIcon from '../PaymentMethodIcon';
import WarningMessage from '../../../Components/Screens/Settings/Components/Payment/WarningMessage';

const PaymentMethodItemBlock = ( {
	paymentMethod,
	onTriggerModal,
	onSelect,
	isSelected,
	isDisabled,
	disabledMessage,
	warningMessage,
} ) => {
	const { activeHighlight, setActiveHighlight } = useActiveHighlight();
	const isHighlighted = activeHighlight === paymentMethod.id;
	const hasWarning = !! warningMessage;

	// Reset the active highlight after 2 seconds
	useEffect( () => {
		if ( isHighlighted ) {
			const timer = setTimeout( () => {
				setActiveHighlight( null );
			}, 2000 );

			return () => clearTimeout( timer );
		}
	}, [ isHighlighted, setActiveHighlight ] );

	// Determine class names based on states
	const methodItemClasses = [
		'ppcp--method-item',
		isHighlighted ? 'ppcp-highlight' : '',
		isDisabled ? 'ppcp--method-item--disabled' : '',
		hasWarning && ! isDisabled ? 'ppcp--method-item--warning' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<SettingsBlock
			id={ paymentMethod.id }
			className={ methodItemClasses }
			separatorAndGap={ false }
		>
			{ isDisabled && (
				<div className="ppcp--method-disabled-overlay">
					<p className="ppcp--method-disabled-message">
						{ disabledMessage }
					</p>
				</div>
			) }
			<div className="ppcp--method-inner">
				<div className="ppcp--method-title-wrapper">
					{ paymentMethod?.icon && (
						<PaymentMethodIcon
							icons={ [ paymentMethod.icon ] }
							type={ paymentMethod.icon }
						/>
					) }
					<span className="ppcp--method-title">
						{ paymentMethod.itemTitle }
					</span>
				</div>
				<p className="ppcp--method-description">
					{ paymentMethod.itemDescription }
				</p>
				<div className="ppcp--method-footer">
					<div className="ppcp--method-toggle-wrapper">
						<ToggleControl
							__nextHasNoMarginBottom
							checked={ isSelected }
							onChange={ onSelect }
						/>
						{ hasWarning && ! isDisabled && isSelected && (
							<WarningMessage warningMessage={ warningMessage } />
						) }
					</div>
					{ paymentMethod?.fields && onTriggerModal && (
						<Button
							className="ppcp--method-settings"
							onClick={ onTriggerModal }
						>
							<Icon icon={ cog } />
						</Button>
					) }
				</div>
			</div>
		</SettingsBlock>
	);
};

export default PaymentMethodItemBlock;
