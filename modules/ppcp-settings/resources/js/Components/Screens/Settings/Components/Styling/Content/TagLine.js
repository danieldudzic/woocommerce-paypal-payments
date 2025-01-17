import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { CheckboxStylingSection } from '../Layout';

const SectionTagline = ( { location } ) => {
	const { isAvailable, tagline, setTagline, choices } =
		StylingHooks.useTaglineProps( location );

	if ( ! isAvailable ) {
		return null;
	}

	return (
		<CheckboxStylingSection
			title={ __( 'Tagline', 'woocommerce-paypal-payments' ) }
			className="tagline"
			options={ choices }
			value={ tagline }
			onChange={ setTagline }
		/>
	);
};

export default SectionTagline;
