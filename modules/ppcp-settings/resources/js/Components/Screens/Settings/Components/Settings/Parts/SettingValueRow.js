const SettingValueRow = ( { label, value } ) => (
	<div className="ppcp-r-setting-value-row">
		{ label && <span className="ppcp-r-setting-label">{ label }</span> }
		<span className="ppcp-r-setting-value">{ value }</span>
	</div>
);

export default SettingValueRow;
