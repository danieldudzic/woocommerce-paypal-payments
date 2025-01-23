import { Icon } from '@wordpress/components';
import { chevronDown, chevronUp } from '@wordpress/icons';

// TODO: Replace this with the WordPress select control once V2 with multi-select is ready.
// see https://wordpress.github.io/gutenberg/?path=/story/components-customselectcontrol-v2--multiple-selection
import { default as ReactSelect, components } from 'react-select';

const DropdownIndicator = ( props ) => (
	<components.DropdownIndicator { ...props }>
		<Icon icon={ props.selectProps.menuIsOpen ? chevronUp : chevronDown } />
	</components.DropdownIndicator>
);
const IndicatorSeparator = () => null;

const Select = ( { options, value, onChange, isMulti, placeholder } ) => (
	<ReactSelect
		className="ppcp-r-select"
		classNamePrefix="ppcp"
		isMulti={ isMulti }
		options={ options }
		value={ value }
		onChange={ onChange }
		placeholder={ placeholder }
		components={ { DropdownIndicator, IndicatorSeparator } }
	/>
);

export default Select;
