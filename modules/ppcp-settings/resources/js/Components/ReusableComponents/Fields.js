import { CheckboxControl } from '@wordpress/components';
import classNames from 'classnames';

export const PayPalCheckbox = ( {
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

	const className = classNames( { 'is-disabled': disabled } );

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

export const CheckboxGroup = ( { options, value, onChange } ) => (
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

export const PayPalRdb = ( {
	id,
	name,
	value,
	currentValue,
	handleRdbState,
} ) => {
	return (
		<div className="ppcp-r__radio">
			{ /* todo: Can we remove the wrapper div? */ }
			<input
				className="ppcp-r__radio-value"
				type="radio"
				id={ id }
				checked={ value === currentValue }
				name={ name }
				value={ value }
				onChange={ () => handleRdbState( value ) }
			/>
			<span className="ppcp-r__radio-presentation"></span>
		</div>
	);
};

export const PayPalRdbWithContent = ( {
	className,
	id,
	name,
	label,
	description,
	value,
	currentValue,
	handleRdbState,
	toggleAdditionalContent,
	children,
} ) => {
	const wrapperClasses = classNames( 'ppcp-r__radio-wrapper', className );

	return (
		<div className="ppcp-r__radio-outer-wrapper">
			<div className={ wrapperClasses }>
				<PayPalRdb
					id={ id }
					name={ name }
					value={ value }
					currentValue={ currentValue }
					handleRdbState={ handleRdbState }
				/>

				<div className="ppcp-r__radio-content">
					<label htmlFor={ id }>{ label }</label>
					{ description && (
						<p
							className="ppcp-r__radio-description"
							dangerouslySetInnerHTML={ {
								__html: description,
							} }
						/>
					) }
				</div>
			</div>
			{ toggleAdditionalContent && children && value === currentValue && (
				<div className="ppcp-r__radio-content-additional">
					{ children }
				</div>
			) }
		</div>
	);
};
