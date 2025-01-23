import { ToggleControl } from '@wordpress/components';
import { Action, Description } from '../Elements';

const ControlToggleButton = ( { label, description, value, onChange } ) => {
	const descriptionContent = description ? (
		<Description>{ description }</Description>
	) : null;

	return (
		<Action>
			<ToggleControl
				className="ppcp--control-toggle"
				__nextHasNoMarginBottom={ true }
				checked={ value }
				onChange={ onChange }
				label={ label }
				help={ descriptionContent }
			/>
		</Action>
	);
};

export default ControlToggleButton;
