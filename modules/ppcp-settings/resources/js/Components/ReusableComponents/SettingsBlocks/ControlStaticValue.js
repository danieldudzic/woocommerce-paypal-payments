import { Action } from '../Elements';

const ControlStaticValue = ( { value } ) => {
	return (
		<Action>
			<div className="ppcp--static-value">{ value }</div>
		</Action>
	);
};

export default ControlStaticValue;
