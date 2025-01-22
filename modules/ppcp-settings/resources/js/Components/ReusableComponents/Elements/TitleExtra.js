const TitleExtra = ( { children } ) => {
	if ( ! children ) {
		return null;
	}

	return (
		<span className="ppcp-r-settings-block__supplementary-title-label">
			{ children }
		</span>
	);
};

export default TitleExtra;
