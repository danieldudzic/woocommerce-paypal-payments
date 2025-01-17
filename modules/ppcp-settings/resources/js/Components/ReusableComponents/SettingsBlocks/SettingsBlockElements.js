import classNames from 'classnames';

// Block Elements
export const Title = ( {
	children,
	altStyle = false,
	big = false,
	className = '',
} ) => {
	const elementClasses = classNames(
		'ppcp-r-settings-block__title',
		className,
		{
			'style-alt': altStyle,
			'style-big': big,
		}
	);

	return <span className={ elementClasses }>{ children }</span>;
};

export const TitleWrapper = ( { children } ) => (
	<span className="ppcp-r-settings-block__title-wrapper">{ children }</span>
);

export const SupplementaryLabel = ( { children } ) => (
	<span className="ppcp-r-settings-block__supplementary-title-label">
		{ children }
	</span>
);

export const Description = ( { children, asHtml = false, className = '' } ) => {
	// Don't output anything if description is empty.
	if ( ! children ) {
		return null;
	}

	const elementClasses = classNames(
		'ppcp-r-settings-block__description',
		className
	);

	if ( ! asHtml ) {
		return <span className={ elementClasses }>{ children }</span>;
	}

	return (
		<span
			className={ elementClasses }
			dangerouslySetInnerHTML={ { __html: children } }
		/>
	);
};

export const Action = ( { children } ) => (
	<div className="ppcp-r-settings-block__action">{ children }</div>
);

export const Header = ( { children, className = '' } ) => (
	<div className={ `ppcp-r-settings-block__header ${ className }`.trim() }>
		{ children }
	</div>
);

// Card Elements
export const Content = ( { children, className = '', id = '' } ) => {
	const elementClasses = classNames(
		'ppcp-r-settings-card__content',
		className
	);

	return (
		<div id={ id } className={ elementClasses }>
			{ children }
		</div>
	);
};

export const ContentWrapper = ( { children } ) => (
	<div className="ppcp-r-settings-card__content-wrapper">{ children }</div>
);
