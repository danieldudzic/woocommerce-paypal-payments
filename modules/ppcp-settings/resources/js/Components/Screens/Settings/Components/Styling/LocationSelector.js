import { SelectControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import StylingSection from './StylingSection';

const LocationSelector = ( { choices = [], location, setLocation } ) => {
	// TODO. move to store/hook.
	const locationData = choices.find(
		( choice ) => choice.value === location
	);
	const { description, link } = locationData || {};
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
				value={ location }
				options={ choices }
				onChange={ ( choice ) => setLocation( choice ) }
			/>
			<p dangerouslySetInnerHTML={ { __html: locationDescription } } />
		</StylingSection>
	);
};

export default LocationSelector;
