import SettingsBlock from '../../../../../ReusableComponents/SettingsBlocks/SettingsBlock';
import {
	Description,
	Header,
	Title,
	Content,
} from '../../../../../ReusableComponents/SettingsBlocks';

const StylingSection = ( {
	title,
	bigTitle = false,
	className = '',
	description = '',
	separatorAndGap = true,
	children,
} ) => {
	return (
		<SettingsBlock
			className={ className }
			separatorAndGap={ separatorAndGap }
		>
			<Header>
				<Title altStyle={ true } big={ bigTitle }>
					{ title }
				</Title>
				<Description>{ description }</Description>
			</Header>

			<Content className="section-content">{ children }</Content>
		</SettingsBlock>
	);
};

export default StylingSection;
