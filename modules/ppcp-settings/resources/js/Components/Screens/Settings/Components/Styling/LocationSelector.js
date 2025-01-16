import { __, sprintf } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../data';
import { Description } from '../../../../ReusableComponents/SettingsBlocks';
import StylingSection from './StylingSection';
import StylingSectionWithSelect from './StylingSectionWithSelect';

const LocationSelector = ( { location, setLocation } ) => {
	const { locationChoices, locationDetails } =
		StylingHooks.useStylingProps( location );
	const { description, link } = locationDetails || {};
	const locationDescription = sprintf( description, link );

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
			<StylingSectionWithSelect
				className="location-selector"
				title={ __( 'Locations', 'woocommerce-paypal-payments' ) }
				separatorAndGap={ false }
				options={ locationChoices }
				value={ location }
				onChange={ setLocation }
			>
				<Description asHtml={ true }>
					{ locationDescription }
				</Description>
			</StylingSectionWithSelect>
		</>
	);
};

export default LocationSelector;
