import classNames from 'classnames';

import { Content } from './Elements';

const SettingsCard = ( {
	id,
	className,
	title,
	description,
	children,
	contentContainer = true,
} ) => {
	const cardClassNames = classNames( 'ppcp-r-settings-card', className );
	const cardProps = {
		className: cardClassNames,
		id,
	};

	const InnerContent = ( { showCards, children: containerItems } ) => {
		if ( showCards ) {
			return <Content>{ containerItems }</Content>;
		}

		return containerItems;
	};

	return (
		<div { ...cardProps }>
			<div className="ppcp-r-settings-card__header">
				<div className="ppcp-r-settings-card__content-inner">
					<span className="ppcp-r-settings-card__title">
						{ title }
					</span>
					<p className="ppcp-r-settings-card__description">
						{ description }
					</p>
				</div>
			</div>

			<InnerContent showCards={ contentContainer }>
				{ children }
			</InnerContent>
		</div>
	);
};

export default SettingsCard;
