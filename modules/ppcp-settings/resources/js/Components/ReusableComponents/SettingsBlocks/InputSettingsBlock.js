import { TextControl } from '@wordpress/components';

import SettingsBlock from './SettingsBlock';
import {
	Title,
	Action,
	Description,
	SupplementaryLabel,
} from './SettingsBlockElements';

const InputSettingsBlock = ( {
	title,
	description,
	supplementaryLabel,
	showDescriptionFirst = false,
	actionProps = {},
	...props
} ) => {
	const TheDescription = <Description>{ description }</Description>;

	return (
		<SettingsBlock { ...props } className="ppcp-r-settings-block__input">
			<Title>
				{ title }
				{ supplementaryLabel && (
					<SupplementaryLabel>
						{ supplementaryLabel }
					</SupplementaryLabel>
				) }
			</Title>
			{ showDescriptionFirst && TheDescription }
			<Action>
				<TextControl
					className="ppcp-r-vertical-text-control"
					placeholder={ actionProps.placeholder }
					value={ actionProps.value }
					onChange={ ( newValue ) =>
						actionProps.callback( actionProps.key, newValue )
					}
				/>
			</Action>
			{ ! showDescriptionFirst && TheDescription }
		</SettingsBlock>
	);
};

export default InputSettingsBlock;
