import { ToggleControl } from '@wordpress/components';

import SettingsBlock from '../SettingsBlock';
import PaymentMethodIcon from '../PaymentMethodIcon';
import data from '../../../utils/data';

const PaymentMethodItemBlock = ( {
	paymentMethod,
	onTriggerModal,
	onSelect,
	isSelected,
} ) => {
	return (
		<SettingsBlock className="ppcp--method-item" separatorAndGap={ false }>
			<div className="ppcp--method-inner">
				<div className="ppcp--method-title-wrapper">
					<PaymentMethodIcon
						icons={ [ paymentMethod.icon ] }
						type={ paymentMethod.icon }
					/>
					<span className="ppcp--method-title">
						{ paymentMethod.itemTitle }
					</span>
				</div>
				<p className="ppcp--method-description">
					{ paymentMethod.itemDescription }
				</p>
				<div className="ppcp--method-footer">
					<ToggleControl
						__nextHasNoMarginBottom={ true }
						checked={ isSelected }
						onChange={ onSelect }
					/>
					{ paymentMethod?.fields && onTriggerModal && (
						<div
							className="ppcp--method-settings"
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
