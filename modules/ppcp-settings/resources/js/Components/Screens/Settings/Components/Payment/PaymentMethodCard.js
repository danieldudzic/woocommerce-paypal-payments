import SettingsCard from '../../../../ReusableComponents/SettingsCard';
import { PaymentMethodsBlock } from '../../../../ReusableComponents/SettingsBlocks';
import usePaymentDependencyState from '../../../../../hooks/usePaymentDependencyState';
import useSettingDependencyState from '../../../../../hooks/useSettingDependencyState';
import PaymentDependencyMessage from './PaymentDependencyMessage';
import SettingDependencyMessage from './SettingDependencyMessage';
import SpinnerOverlay from '../../../../ReusableComponents/SpinnerOverlay';
import { PaymentHooks, SettingsHooks } from '../../../../../data';

/**
 * Renders a payment method card with dependency handling
 *
 * @param {Object}               props                 - Component props
 * @param {string}               props.id              - Unique identifier for the card
 * @param {string}               props.title           - Title of the payment method card
 * @param {string}               props.description     - Description of the payment method
 * @param {string}               props.icon            - Icon path for the payment method
 * @param {Array}                props.methods         - List of payment methods to display
 * @param {Object}               props.methodsMap      - Map of all payment methods by ID
 * @param {Function}             props.onTriggerModal  - Callback when a method is clicked
 * @param {boolean}              props.isDisabled      - Whether the entire card is disabled
 * @param {(string|JSX.Element)} props.disabledMessage - Message to show when disabled
 * @return {JSX.Element} The rendered component
 */
const PaymentMethodCard = ( {
	id,
	title,
	description,
	icon,
	methods,
	methodsMap = {},
	onTriggerModal,
	isDisabled = false,
} ) => {
	const { isReady: isPaymentStoreReady } = PaymentHooks.useStore();
	const { isReady: isSettingsStoreReady } = SettingsHooks.useStore();

	const paymentDependencies = usePaymentDependencyState(
		methods,
		methodsMap
	);

	const settingDependencies = useSettingDependencyState( methods );

	if ( ! isPaymentStoreReady || ! isSettingsStoreReady ) {
		return <SpinnerOverlay asModal={ true } />;
	}

	return (
		<SettingsCard
			id={ id }
			title={ title }
			description={ description }
			icon={ icon }
			contentContainer={ false }
		>
			<PaymentMethodsBlock
				paymentMethods={ methods.map( ( method ) => {
					const paymentDependency =
						paymentDependencies?.[ method.id ];
					const settingDependency =
						settingDependencies?.[ method.id ];

					let dependencyMessage = null;
					let isMethodDisabled = method.isDisabled || isDisabled;

					if ( paymentDependency ) {
						dependencyMessage = (
							<PaymentDependencyMessage
								parentId={ paymentDependency.parentId }
								parentName={ paymentDependency.parentName }
							/>
						);
						isMethodDisabled = true;
					} else if ( settingDependency?.isDisabled ) {
						dependencyMessage = (
							<SettingDependencyMessage
								settingId={ settingDependency.settingId }
								requiredValue={
									settingDependency.requiredValue
								}
								methodId={ method.id }
							/>
						);
						isMethodDisabled = true;
					}

					return {
						...method,
						isDisabled: isMethodDisabled,
						disabledMessage: dependencyMessage,
					};
				} ) }
				onTriggerModal={ onTriggerModal }
			/>
		</SettingsCard>
	);
};

export default PaymentMethodCard;
