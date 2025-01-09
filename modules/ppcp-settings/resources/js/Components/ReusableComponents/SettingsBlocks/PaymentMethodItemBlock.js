import { ToggleControl } from '@wordpress/components';
import SettingsBlock from './SettingsBlock';
import PaymentMethodIcon from '../PaymentMethodIcon';
import data from '../../../utils/data';
import { hasSettings } from '../../Screens/Overview/TabSettingsElements/Blocks/PaymentMethods';

const PaymentMethodItemBlock = ( {
	id,
	title,
	description,
	icon,
	onTriggerModal,
	onSelect,
	isSelected,
} ) => {
	// Only show settings icon if this method has fields configured
	const hasModal = hasSettings( id );

	return (
		<SettingsBlock className="ppcp-r-settings-block__payment-methods__item">
			<div className="ppcp-r-settings-block__payment-methods__item__inner">
				<div className="ppcp-r-settings-block__payment-methods__item__title-wrapper">
					<PaymentMethodIcon icons={ [ icon ] } type={ icon } />
					<span className="ppcp-r-settings-block__payment-methods__item__title">
						{ title }
					</span>
				</div>
				<p className="ppcp-r-settings-block__payment-methods__item__description">
					{ description }
				</p>
				<div className="ppcp-r-settings-block__payment-methods__item__footer">
					<ToggleControl
						__nextHasNoMarginBottom={ true }
						checked={ isSelected }
						onChange={ onSelect }
					/>
					{ hasModal && onTriggerModal && (
						<div
							className="ppcp-r-settings-block__payment-methods__item__settings"
							onClick={ onTriggerModal }
						>
							{ data().getImage( 'icon-settings.svg' ) }
						</div>
					) }
				</div>
			</div>
		</SettingsBlock>
	);
};

export default PaymentMethodItemBlock;
