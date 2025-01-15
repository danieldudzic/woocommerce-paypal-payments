import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RadioControl, SelectControl } from '@wordpress/components';

import { STYLING_LOCATIONS } from '../../../../../data';
import { PayPalCheckboxGroup } from '../../../../ReusableComponents/Fields';
import LocationSelector from './LocationSelector';
import StylingSection from './StylingSection';

const SettingsPanel = () => {
	const { location, setLocation } = useState( 'cart' );

	const currentLocationSettings = {
		settings: { shape: '', label: '', color: '' },
	};
	const handleChange = () => {};

	return (
		<div className="settings-panel">
			<LocationSelector
				choices={ Object.values( STYLING_LOCATIONS ) }
				location={ location }
				setLocation={ setLocation }
			/>

			<SectionPaymentMethods
				locationSettings={ currentLocationSettings }
				updateButtonSettings={ handleChange }
			/>

			<SectionButtonLayout
				locationSettings={ currentLocationSettings }
				updateButtonStyle={ handleChange }
			/>

			<SectionButtonShape
				locationSettings={ currentLocationSettings }
				updateButtonStyle={ handleChange }
			/>
			<SectionButtonLabel
				locationSettings={ currentLocationSettings }
				updateButtonStyle={ handleChange }
			/>
			<SectionButtonColor
				locationSettings={ currentLocationSettings }
				updateButtonStyle={ handleChange }
			/>
			<SectionButtonTagline
				locationSettings={ currentLocationSettings }
				updateButtonStyle={ handleChange }
			/>
		</div>
	);
};

export default SettingsPanel;

// -----
const SectionPaymentMethods = ( {
	locationSettings,
	updateButtonSettings,
} ) => {
	const paymentMethodOptions = [];

	return (
		<StylingSection
			title={ __( 'Payment Methods', 'woocommerce-paypal-payments' ) }
			className="ppcp-r-styling__section--rc"
		>
			<div className="ppcp-r-styling__payment-method-checkboxes">
				<PayPalCheckboxGroup
					value={ paymentMethodOptions }
					changeCallback={ ( newValue ) =>
						updateButtonSettings( 'paymentMethods', newValue )
					}
					currentValue={ locationSettings.paymentMethods }
				/>
			</div>
		</StylingSection>
	);
};

const SectionButtonLayout = ( { locationSettings, updateButtonStyle } ) => {
	const buttonLayoutIsAllowed =
		locationSettings.layout && locationSettings.tagline === false;
	return (
		buttonLayoutIsAllowed && (
			<StylingSection
				className="ppcp-r-styling__section--rc"
				title={ __( 'Button Layout', 'woocommerce-paypal-payments' ) }
			>
				<RadioControl
					className="ppcp-r__horizontal-control"
					onChange={ ( newValue ) =>
						updateButtonStyle( 'layout', newValue )
					}
					selected={ locationSettings.layout }
					options={ [] }
				/>
			</StylingSection>
		)
	);
};

const SectionButtonShape = ( { locationSettings, updateButtonStyle } ) => {
	return (
		<StylingSection
			title={ __( 'Shape', 'woocommerce-paypal-payments' ) }
			className="ppcp-r-styling__section--rc"
		>
			<RadioControl
				className="ppcp-r__horizontal-control"
				onChange={ ( newValue ) =>
					updateButtonStyle( 'shape', newValue )
				}
				selected={ locationSettings.shape }
				options={ [] }
			/>
		</StylingSection>
	);
};

const SectionButtonLabel = ( { locationSettings, updateButtonStyle } ) => {
	return (
		<StylingSection>
			<SelectControl
				className="ppcp-r-styling__select"
				onChange={ ( newValue ) =>
					updateButtonStyle( 'label', newValue )
				}
				value={ locationSettings.label }
				label={ __( 'Button Label', 'woocommerce-paypal-payments' ) }
				options={ [] }
			/>
		</StylingSection>
	);
};

const SectionButtonColor = ( { locationSettings, updateButtonStyle } ) => {
	return (
		<StylingSection>
			<SelectControl
				className=" ppcp-r-styling__select"
				label={ __( 'Button Color', 'woocommerce-paypal-payments' ) }
				onChange={ ( newValue ) =>
					updateButtonStyle( 'color', newValue )
				}
				value={ locationSettings.color }
				options={ [] }
			/>
		</StylingSection>
	);
};

const SectionButtonTagline = ( { locationSettings, updateButtonStyle } ) => {
	const taglineIsAllowed =
		locationSettings.hasOwnProperty( 'tagline' ) &&
		locationSettings.layout === 'horizontal';

	return (
		taglineIsAllowed && (
			<StylingSection
				title={ __( 'Tagline', 'woocommerce-paypal-payments' ) }
				className="ppcp-r-styling__section--rc"
			>
				<PayPalCheckboxGroup
					value={ [
						{
							value: 'tagline',
							label: __(
								'Enable Tagline',
								'woocommerce-paypal-payments'
							),
						},
					] }
					changeCallback={ ( newValue ) => {
						updateButtonStyle( 'tagline', newValue );
					} }
					currentValue={ locationSettings.tagline }
				/>
			</StylingSection>
		)
	);
};
