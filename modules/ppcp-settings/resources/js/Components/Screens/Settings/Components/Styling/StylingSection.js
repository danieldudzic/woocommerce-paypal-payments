import classnames from 'classnames';

const StylingSection = ( {
	title,
	className = '',
	description = '',
	children,
} ) => {
	const sectionClasses = classnames( 'ppcp-r-styling__section', className );

	return (
		<div className={ sectionClasses }>
			<span className="ppcp-r-styling__title">{ title }</span>

			{ description && (
				<p
					className="ppcp-r-styling__description"
					dangerouslySetInnerHTML={ {
						__html: description,
					} }
				/>
			) }

			{ children }
		</div>
	);
};

export default StylingSection;
