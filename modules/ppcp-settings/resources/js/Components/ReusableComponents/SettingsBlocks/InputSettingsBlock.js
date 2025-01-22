import { TextControl } from '@wordpress/components';

import SettingsBlock from '../SettingsBlock';
import { Title, Action, Description, TitleExtra } from '../Elements';

const InputSettingsBlock = ( {
	title,
	description,
	supplementaryLabel,
	showDescriptionFirst = false,
	value,
	onChange,
	placeholder = '',
} ) => {
	const TheDescription = <Description>{ description }</Description>;

	return (
		<SettingsBlock className="ppcp-r-settings-block__input">
			<Title>
				{ title }
				<TitleExtra>{ supplementaryLabel }</TitleExtra>
			</Title>
			{ showDescriptionFirst && TheDescription }
			<Action>
				<TextControl
					className="ppcp-r-vertical-text-control"
					placeholder={ placeholder }
					value={ value }
					onChange={ onChange }
				/>
			</Action>
			{ ! showDescriptionFirst && TheDescription }
		</SettingsBlock>
	);
};

export default InputSettingsBlock;
