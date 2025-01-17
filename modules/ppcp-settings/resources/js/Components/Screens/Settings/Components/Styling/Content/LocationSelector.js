import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { help } from '@wordpress/icons';

import { StylingHooks } from '../../../../../../data';
import { SelectStylingSection, StylingSection } from '../Layout';

const LocationSelector = ( { location, setLocation } ) => {
	const { choices, details } = StylingHooks.useLocationProps( location );

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
				{ details.link && (
					<Button
						icon={ help }
						href={ details.link }
						target="_blank"
					/>
				) }
			</SelectStylingSection>
		</>
	);
};

export default LocationSelector;
