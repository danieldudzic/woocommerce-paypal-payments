import { CheckboxControl } from '@wordpress/components';
import classNames from 'classnames';

const Checkbox = ( {
	currentValue,
	label,
	value,
	checked = null,
	disabled = null,
	changeCallback,
} ) => {
	let isChecked = checked;

	if ( null === isChecked ) {
		if ( Array.isArray( currentValue ) ) {
			isChecked = currentValue.includes( value );
		} else {
			isChecked = currentValue;
		}
	}

	const className = classNames( { 'ppcp--is-disabled': disabled } );

	const onChange = ( newState ) => {
		let newValue;

		if ( ! Array.isArray( currentValue ) ) {
			newValue = newState;
		} else if ( newState ) {
			newValue = [ ...currentValue, value ];
		} else {
			newValue = currentValue.filter(
				( optionValue ) => optionValue !== value
			);
		}

		changeCallback( newValue );
	};

	return (
		<CheckboxControl
			label={ label }
			value={ value }
			checked={ isChecked }
			disabled={ disabled }
			onChange={ onChange }
			className={ className }
		/>
	);
};

export default Checkbox;
