import data from '../../utils/data';

const ImageBadge = ( { images } ) => {
	if ( ! images || ! images.length ) {
		return null;
	}

	return (
		<BadgeContent>
			<span className="ppcp-r-badge-box__title-image-badge">
				{ images.map( ( badge ) => data().getImage( badge ) ) }
			</span>
		</BadgeContent>
	);
};

// If `children` is not empty, the `children` prop is output and wrapped in spaces.
const BadgeContent = ( { children } ) => {
	if ( ! children ) {
		return null;
	}
	return <> { children } </>;
};

const BadgeBox = ( {
	title,
	textBadge,
	imageBadge = [],
	description = '',
} ) => {
	const titleTextClassName = 'ppcp-r-badge-box__title-text';
	const titleBaseClassName = 'ppcp-r-badge-box__title';
	const titleClassName = imageBadge.length
		? `${ titleBaseClassName } ppcp-r-badge-box__title--has-image-badge`
		: titleBaseClassName;

	return (
		<div className="ppcp-r-badge-box">
			<span className={ titleClassName }>
				<span className={ titleTextClassName }>{ title }</span>

				<ImageBadge images={ imageBadge } />
				<BadgeContent>{ textBadge }</BadgeContent>
			</span>
			<div className="ppcp-r-badge-box__description">
				{ description && (
					<p
						className="ppcp-r-badge-box__description"
						dangerouslySetInnerHTML={ {
							__html: description,
						} }
					></p>
				) }
			</div>
		</div>
	);
};

export default BadgeBox;
