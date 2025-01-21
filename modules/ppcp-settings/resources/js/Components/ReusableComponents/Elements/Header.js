import classNames from 'classnames';

const Header = ( { children, className = '' } ) => {
	const elementClasses = classNames(
		'ppcp-r-settings-block__header',
		className
	);

	return <div className={ elementClasses }>{ children }</div>;
};

export default Header;
