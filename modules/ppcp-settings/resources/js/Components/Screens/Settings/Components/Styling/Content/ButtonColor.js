import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { SelectStylingSection } from '../Layout';

const SectionButtonColor = ( { location } ) => {
	const { color, setColor, colorChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<SelectStylingSection
			title={ __( 'Button Color', 'woocommerce-paypal-payments' ) }
			className="button-color"
			options={ colorChoices }
			value={ color }
			onChange={ setColor }
		/>
	);
};

export default SectionButtonColor;
