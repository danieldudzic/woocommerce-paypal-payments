import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { SelectStylingSection } from '../Layout';

const SectionButtonLabel = ( { location } ) => {
	const { label, setLabel, labelChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<SelectStylingSection
			title={ __( 'Button Label', 'woocommerce-paypal-payments' ) }
			className="button-label"
			options={ labelChoices }
			value={ label }
			onChange={ setLabel }
		/>
	);
};

export default SectionButtonLabel;
