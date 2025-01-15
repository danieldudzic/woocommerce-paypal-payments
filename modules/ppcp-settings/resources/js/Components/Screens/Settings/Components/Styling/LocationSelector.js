import { SelectControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

// Dummy hook.
import { useStylingProps } from '../../Tabs/TabStyling';

import StylingSection from './StylingSection';

const LocationSelector = ( { location, setLocation } ) => {
	const { locationChoices, locationDetails } = useStylingProps( location );
	const { description, link } = locationDetails || {};
	const locationDescription = sprintf( description, link );

	return (
		<StylingSection
			className="header-section"
			title={ __( 'Button Styling', 'wooocommerce-paypal-payments' ) }
			description={ __(
				'Customize the appearance of the PayPal smart buttons on your website and choose which payment buttons to display.',
				'woocommerce-paypal-payments'
			) }
		>
			<SelectControl
				className="ppcp-r-styling__select"
				label={ __( 'Locations', 'woocommerce-paypal-payments' ) }
				options={ locationChoices }
				value={ location }
				onChange={ setLocation }
			/>
			<p dangerouslySetInnerHTML={ { __html: locationDescription } } />
		</StylingSection>
	);
};

export default LocationSelector;
