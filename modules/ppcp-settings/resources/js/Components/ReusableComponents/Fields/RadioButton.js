const RadioButton = ( { id, name, value, currentValue, handleRdbState } ) => {
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

export default RadioButton;
