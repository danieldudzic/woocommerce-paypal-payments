import { useState, useCallback } from '@wordpress/element';
import SettingsBlock from './SettingsBlock';
import PaymentMethodItemBlock from './PaymentMethodItemBlock';

const PaymentMethodsBlock = ( {
	paymentMethods,
	className = '',
	onTriggerModal,
} ) => {
	const [ selectedMethods, setSelectedMethods ] = useState( {} );

	const handleSelect = useCallback( ( methodId, isSelected ) => {
		setSelectedMethods( ( prev ) => ( {
			...prev,
			[ methodId ]: isSelected,
		} ) );
	}, [] );

	if ( ! paymentMethods?.length ) {
		return null;
	}

	return (
		<SettingsBlock
			className={ `ppcp-r-settings-block__payment-methods ${ className }` }
		>
			{ paymentMethods.map( ( paymentMethod ) => (
				<PaymentMethodItemBlock
					key={ paymentMethod.id }
					{ ...paymentMethod }
					isSelected={ Boolean(
						selectedMethods[ paymentMethod.id ]
					) }
					onSelect={ ( checked ) =>
						handleSelect( paymentMethod.id, checked )
					}
					onTriggerModal={ () =>
						onTriggerModal?.( paymentMethod.id )
					}
				/>
			) ) }
		</SettingsBlock>
	);
};

export default PaymentMethodsBlock;
