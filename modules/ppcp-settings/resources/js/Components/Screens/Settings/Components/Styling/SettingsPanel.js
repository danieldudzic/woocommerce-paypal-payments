import { __ } from '@wordpress/i18n';

import { StylingHooks } from '../../../../../data';
import LocationSelector from './LocationSelector';
import StylingSectionWithSelect from './StylingSectionWithSelect';
import StylingSectionWithCheckboxes from './StylingSectionWithCheckboxes';
import StylingSectionWithRadiobuttons from './StylingSectionWithRadiobuttons';

const SettingsPanel = () => {
	const { location, setLocation } = StylingHooks.useStylingLocation();

	return (
		<div className="settings-panel">
			<LocationSelector
				location={ location }
				setLocation={ setLocation }
			/>
			<SectionPaymentMethods location={ location } />
			<SectionButtonLayout location={ location } />
			<SectionButtonShape location={ location } />
			<SectionButtonLabel location={ location } />
			<SectionButtonColor location={ location } />
			<SectionButtonTagline location={ location } />
		</div>
	);
};

export default SettingsPanel;

// -----

const SectionPaymentMethods = ( { location } ) => {
	const { paymentMethods, setPaymentMethods, paymentMethodChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<StylingSectionWithCheckboxes
			title={ __( 'Payment Methods', 'woocommerce-paypal-payments' ) }
			className="payment-methods"
			options={ paymentMethodChoices }
			value={ paymentMethods }
			onChange={ setPaymentMethods }
		/>
	);
};

const SectionButtonLayout = ( { location } ) => {
	const { supportsLayout, layout, setLayout, layoutChoices } =
		StylingHooks.useStylingProps( location );

	if ( ! supportsLayout ) {
		return null;
	}

	return (
		<StylingSectionWithRadiobuttons
			className="button-layout"
			title={ __( 'Button Layout', 'woocommerce-paypal-payments' ) }
			options={ layoutChoices }
			selected={ layout }
			onChange={ setLayout }
		/>
	);
};

const SectionButtonShape = ( { location } ) => {
	const { shape, setShape, shapeChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<StylingSectionWithRadiobuttons
			title={ __( 'Shape', 'woocommerce-paypal-payments' ) }
			className="button-shape"
			options={ shapeChoices }
			selected={ shape }
			onChange={ setShape }
		/>
	);
};

const SectionButtonLabel = ( { location } ) => {
	const { label, setLabel, labelChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<StylingSectionWithSelect
			title={ __( 'Button Label', 'woocommerce-paypal-payments' ) }
			className="button-label"
			options={ labelChoices }
			value={ label }
			onChange={ setLabel }
		/>
	);
};

const SectionButtonColor = ( { location } ) => {
	const { color, setColor, colorChoices } =
		StylingHooks.useStylingProps( location );

	return (
		<StylingSectionWithSelect
			title={ __( 'Button Color', 'woocommerce-paypal-payments' ) }
			className="button-color"
			options={ colorChoices }
			value={ color }
			onChange={ setColor }
		/>
	);
};

const SectionButtonTagline = ( { location } ) => {
	const { supportsTagline, tagline, setTagline, taglineChoices } =
		StylingHooks.useStylingProps( location );

	if ( ! supportsTagline ) {
		return null;
	}

	return (
		<StylingSectionWithCheckboxes
			title={ __( 'Tagline', 'woocommerce-paypal-payments' ) }
			className="tagline"
			options={ taglineChoices }
			value={ tagline }
			onChange={ setTagline }
		/>
	);
};
