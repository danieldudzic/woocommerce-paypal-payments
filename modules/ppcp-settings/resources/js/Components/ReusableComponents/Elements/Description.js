import classNames from 'classnames';

const Description = ( { children, asHtml = false, className = '' } ) => {
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

export default Description;
