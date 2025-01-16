import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { CheckboxStylingSection } from '../Layout';

const SectionTagline = ( { location } ) => {
	const { supportsTagline, tagline, setTagline, taglineChoices } =
		StylingHooks.useStylingProps( location );

	if ( ! supportsTagline ) {
		return null;
	}

	return (
		<CheckboxStylingSection
			title={ __( 'Tagline', 'woocommerce-paypal-payments' ) }
			className="tagline"
			options={ taglineChoices }
			value={ tagline }
			onChange={ setTagline }
		/>
	);
};

export default SectionTagline;
