import data from '../../utils/data';
import { PayPalCheckbox, PayPalRdb } from './Fields';

const SelectBox = ( props ) => {
	let boxClassName = 'ppcp-r-select-box';

	if (
		props.value === props.currentValue ||
		( Array.isArray( props.currentValue ) &&
			props.currentValue.includes( props.value ) )
	) {
		boxClassName += ' selected';
	}

	const handleClick = () => {
		if ( props.type === 'checkbox' ) {
			let newValue;

			if ( Array.isArray( props.currentValue ) ) {
				if ( props.currentValue.includes( props.value ) ) {
					newValue = props.currentValue.filter(
						( optionValue ) => optionValue !== props.value
					);
				} else {
					newValue = [ ...props.currentValue, props.value ];
				}
			} else {
				newValue = ! props.currentValue;
			}

			props.changeCallback( newValue );
		}
	};

	return (
		<div
			className={ boxClassName }
			onClick={ props.type === 'checkbox' ? handleClick : undefined }
		>
			{ props.type === 'radio' && (
				<PayPalRdb
					{ ...{
						...props,
						handleRdbState: props.changeCallback,
					} }
				/>
			) }
			{ props.type === 'checkbox' && <PayPalCheckbox { ...props } /> }
			<div className="ppcp-r-select-box__content">
				<div className="ppcp-r-select-box__content-inner">
					<span className="ppcp-r-select-box__title">
						{ props.title }
					</span>
					<p className="ppcp-r-select-box__description">
						{ props.description }
					</p>
					{ props.children && (
						<div className="ppcp-r-select-box__additional-content">
							{ props.children }
						</div>
					) }
				</div>
			</div>
		</div>
	);
};

export default SelectBox;
