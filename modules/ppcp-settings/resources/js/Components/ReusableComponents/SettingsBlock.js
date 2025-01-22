import classNames from 'classnames';

const SettingsBlock = ( { className, children, separatorAndGap = true } ) => {
	const blockClassName = classNames( 'ppcp-r-settings-block', className, {
		'ppcp--no-gap': ! separatorAndGap,
	} );

	return <div className={ blockClassName }>{ children }</div>;
};

export default SettingsBlock;
