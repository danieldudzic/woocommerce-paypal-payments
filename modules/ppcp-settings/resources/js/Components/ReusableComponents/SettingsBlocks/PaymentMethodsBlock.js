import SettingsBlock from '../SettingsBlock';
import PaymentMethodItemBlock from './PaymentMethodItemBlock';
import { PaymentHooks } from '../../../data';

// TODO: This is not a reusable component, as it's connected to the Redux store.
const PaymentMethodsBlock = ( { paymentMethods = [], onTriggerModal } ) => {
	const { setPersistent } = PaymentHooks.useStore();

	if ( ! paymentMethods.length ) {
		return null;
	}

	const handleSelect = ( paymentMethod, isSelected ) => {
		setPersistent( paymentMethod.id, {
			...paymentMethod,
			enabled: isSelected,
		} );
	};

	return (
		<SettingsBlock className="ppcp--grid ppcp-r-settings-block__payment-methods">
			{ paymentMethods.map( ( paymentMethod ) => (
				<PaymentMethodItemBlock
					key={ paymentMethod.id }
					paymentMethod={ paymentMethod }
					isSelected={ paymentMethod.enabled }
					onSelect={ ( checked ) =>
						handleSelect( paymentMethod, checked )
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
