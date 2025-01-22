import classNames from 'classnames';
import { PayPalCheckbox, PayPalRdb } from './index';

const SelectableContent = ( {
	title,
	description,
	type = 'checkbox',
	children,
	name,
	value,
	changeCallback,
	currentValue,
	checked = null,
} ) => {
	let isSelected;

	if ( Array.isArray( currentValue ) ) {
		isSelected = currentValue.includes( value );
	} else {
		isSelected = value === currentValue;
	}

	const boxClassName = classNames( 'ppcp-r-select-box', {
		selected: isSelected,
	} );

	const InputField = ( { isRadio } ) => {
		if ( isRadio ) {
			return (
				<PayPalRdb
					name={ name }
					value={ value }
					handleRdbState={ changeCallback }
					currentValue={ currentValue }
				/>
			);
		}

		return (
			<PayPalCheckbox
				value={ value }
				changeCallback={ changeCallback }
				currentValue={ currentValue }
				checked={ checked }
			/>
		);
	};

	return (
		<div className={ boxClassName }>
			<InputField isRadio={ type === 'radio' } />

			<div className="ppcp-r-select-box__content">
				<div className="ppcp-r-select-box__content-inner">
					<span className="ppcp-r-select-box__title">{ title }</span>
					<p className="ppcp-r-select-box__description">
						{ description }
					</p>
					{ children && (
						<div className="ppcp-r-select-box__additional-content">
							{ children }
						</div>
					) }
				</div>
			</div>
		</div>
	);
};

export default SelectableContent;
