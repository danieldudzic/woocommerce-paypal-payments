import classNames from 'classnames';

// Block Elements
export const Title = ( {
	children,
	altStyle = false,
	big = false,
	className = '',
} ) => {
	className = classNames( 'ppcp-r-settings-block__title', className, {
		'style-alt': altStyle,
		'style-big': big,
	} );

	return <span className={ className }>{ children }</span>;
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

	className = classNames( 'ppcp-r-settings-block__description', className );

	if ( ! asHtml ) {
		return <span className={ className }>{ children }</span>;
	}

	return (
		<span
			className={ className }
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
export const Content = ( { children, id = '' } ) => (
	<div id={ id } className="ppcp-r-settings-card__content">
		{ children }
	</div>
);

export const ContentWrapper = ( { children } ) => (
	<div className="ppcp-r-settings-card__content-wrapper">{ children }</div>
);
