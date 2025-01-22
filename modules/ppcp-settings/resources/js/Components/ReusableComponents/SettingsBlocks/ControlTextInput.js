import { TextControl } from '@wordpress/components';

import { Action } from '../Elements';

const ControlTextInput = ( { value, onChange, placeholder = '' } ) => {
	return (
		<Action>
			<TextControl
				className="ppcp-r-vertical-text-control"
				placeholder={ placeholder }
				value={ value }
				onChange={ onChange }
			/>
		</Action>
	);
};

export default ControlTextInput;
