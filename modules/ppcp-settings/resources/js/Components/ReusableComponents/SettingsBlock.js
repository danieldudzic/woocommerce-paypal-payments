import classNames from 'classnames';
import { Description, Header, Title, TitleExtra, Content } from './Elements';

const SettingsBlock = ( {
	className,
	children,
	title,
	titleSuffix,
	headerDescription,
	description,
	horizontalLayout = false,
	separatorAndGap = true,
} ) => {
	const blockClassName = classNames( 'ppcp-r-settings-block', className, {
		'ppcp--no-gap': ! separatorAndGap,
		'ppcp--horizontal': horizontalLayout,
	} );

	return (
		<div className={ blockClassName }>
			<Header>
				<Title>
					{ title } <TitleExtra>{ titleSuffix }</TitleExtra>
				</Title>
				<Description>{ headerDescription }</Description>
			</Header>

			<Content asCard={ false }>
				{ children }

				<Description>{ description }</Description>
			</Content>
		</div>
	);
};

export default SettingsBlock;
