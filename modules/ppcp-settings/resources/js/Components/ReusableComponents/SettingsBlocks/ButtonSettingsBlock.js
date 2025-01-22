import { Button } from '@wordpress/components';

import SettingsBlock from '../SettingsBlock';
import { Action } from '../Elements';

const ButtonSettingsBlock = ( { title, description, ...props } ) => (
	<SettingsBlock
		title={ title }
		headerDescription={ description }
		horizontalLayout={ true }
		className="ppcp-r-settings-block__button"
		{ ...props }
	>
		<Action>
			<Button
				isBusy={ props.actionProps?.isBusy }
				variant={ props.actionProps?.buttonType }
				onClick={
					props.actionProps?.callback
						? () => props.actionProps.callback()
						: undefined
				}
			>
				{ props?.actionProps?.value }
			</Button>
		</Action>
	</SettingsBlock>
);

export default ButtonSettingsBlock;
