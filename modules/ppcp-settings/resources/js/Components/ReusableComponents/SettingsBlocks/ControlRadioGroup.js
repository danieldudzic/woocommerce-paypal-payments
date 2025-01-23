import { PayPalRdbWithContent } from '../Fields';
import { Action } from '../Elements';

const ControlRadioGroup = ( { options, value, onChange } ) => (
	<Action>
		{ options.map( ( { value: optionValue, label, description } ) => (
			<PayPalRdbWithContent
				key={ optionValue }
				value={ optionValue }
				currentValue={ value }
				handleRdbState={ onChange }
				label={ label }
				description={ description }
			/>
		) ) }
	</Action>
);

export default ControlRadioGroup;
