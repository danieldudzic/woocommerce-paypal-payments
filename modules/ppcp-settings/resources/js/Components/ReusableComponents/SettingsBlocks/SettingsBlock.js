import classNames from 'classnames';

const SettingsBlock = ( { className, children } ) => {
	const blockClassName = classNames( 'ppcp-r-settings-block', className );

	return <div className={ blockClassName }>{ children }</div>;
};

export default SettingsBlock;
