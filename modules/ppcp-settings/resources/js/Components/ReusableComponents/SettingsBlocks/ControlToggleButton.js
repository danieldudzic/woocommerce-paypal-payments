import { ToggleControl } from '@wordpress/components';
import { Action, Description } from '../Elements';

const ControlToggleButton = ( { label, description, value, onChange } ) => {
	return (
		<Action>
			<ToggleControl
				className="ppcp-r-settings-block__toggle-control"
				__nextHasNoMarginBottom={ true }
				checked={ value }
				onChange={ onChange }
				label={ label }
				help={ <Description>{ description }</Description> }
			/>
		</Action>
	);
};

export default ControlToggleButton;
