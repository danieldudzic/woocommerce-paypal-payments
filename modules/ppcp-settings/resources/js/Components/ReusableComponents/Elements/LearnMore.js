const LearnMore = ( { url } ) => {
	if ( ! url || '#' === url ) {
		console.warn( 'Missing Learn More URL: ', url );
	}

	return (
		<a href={ url } target="_blank" rel="noreferrer">
			Learn more
		</a>
	);
};

export default LearnMore;
