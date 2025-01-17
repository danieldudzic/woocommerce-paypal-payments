import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../../data';
import { Description } from '../../../../../ReusableComponents/SettingsBlocks';
import { SelectStylingSection, StylingSection } from '../Layout';

const LocationSelector = ( { location, setLocation } ) => {
	const { choices, description } = StylingHooks.useLocationProps( location );

	return (
		<>
			<StylingSection
				className="header-section"
				bigTitle={ true }
				title={ __( 'Button Styling', 'wooocommerce-paypal-payments' ) }
				description={ __(
					'Customize the appearance of the PayPal smart buttons on your website and choose which payment buttons to display.',
					'woocommerce-paypal-payments'
				) }
			></StylingSection>
			<SelectStylingSection
				className="location-selector"
				title={ __( 'Location', 'woocommerce-paypal-payments' ) }
				separatorAndGap={ false }
				options={ choices }
				value={ location }
				onChange={ setLocation }
			>
				<Description asHtml={ true }>{ description }</Description>
			</SelectStylingSection>
		</>
	);
};

export default LocationSelector;
