import { Button } from '@wordpress/components';

import SettingsBlock from '../SettingsBlock';
import { Action } from '../Elements';

const ControlButton = ( {
	title,
	description,
	type = 'secondary',
	isBusy,
	onClick,
	buttonLabel,
} ) => (
	<SettingsBlock
		title={ title }
		headerDescription={ description }
		horizontalLayout={ true }
		className="ppcp--button-block"
	>
		<Action>
			<Button isBusy={ isBusy } variant={ type } onClick={ onClick }>
				{ buttonLabel }
			</Button>
		</Action>
	</SettingsBlock>
);

export default ControlButton;
