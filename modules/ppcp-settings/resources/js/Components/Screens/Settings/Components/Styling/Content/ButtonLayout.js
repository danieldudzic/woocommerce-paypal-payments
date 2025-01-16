import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { RadiobuttonStylingSection } from '../Layout';

const SectionButtonLayout = ( { location } ) => {
	const { supportsLayout, layout, setLayout, layoutChoices } =
		StylingHooks.useStylingProps( location );

	if ( ! supportsLayout ) {
		return null;
	}

	return (
		<RadiobuttonStylingSection
			className="button-layout"
			title={ __( 'Button Layout', 'woocommerce-paypal-payments' ) }
			options={ layoutChoices }
			selected={ layout }
			onChange={ setLayout }
		/>
	);
};

export default SectionButtonLayout;
