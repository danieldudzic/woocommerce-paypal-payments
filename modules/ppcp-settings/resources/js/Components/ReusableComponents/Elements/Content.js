import classNames from 'classnames';

const Content = ( { children, className = '', id = '' } ) => {
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

export default Content;
