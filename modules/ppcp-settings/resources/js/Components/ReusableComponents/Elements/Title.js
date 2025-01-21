import classNames from 'classnames';

const Title = ( {
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

export default Title;
