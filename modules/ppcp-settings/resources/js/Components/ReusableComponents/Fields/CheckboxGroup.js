import { PayPalCheckbox } from './index';

const CheckboxGroup = ( { options, value, onChange } ) => (
	<>
		{ options.map( ( checkbox ) => (
			<PayPalCheckbox
				key={ checkbox.value }
				label={ checkbox.label }
				value={ checkbox.value }
				checked={ checkbox.checked }
				disabled={ checkbox.disabled }
				description={ checkbox.description }
				tooltip={ checkbox.tooltip }
				currentValue={ value }
				changeCallback={ onChange }
			/>
		) ) }
	</>
);

export default CheckboxGroup;
