import { __ } from '@wordpress/i18n';
import { RadioControl, SelectControl } from '@wordpress/components';

// Dummy hook.
import { useStylingLocation, useStylingProps } from '../../Tabs/TabStyling';

import { PayPalCheckboxGroup } from '../../../../ReusableComponents/Fields';
import LocationSelector from './LocationSelector';
import StylingSection from './StylingSection';

const SettingsPanel = () => {
	const { location, setLocation } = useStylingLocation();

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
		useStylingProps( location );

	return (
		<StylingSection
			title={ __( 'Payment Methods', 'woocommerce-paypal-payments' ) }
			className="payment-methods"
		>
			<PayPalCheckboxGroup
				value={ paymentMethodChoices }
				currentValue={ paymentMethods }
				changeCallback={ setPaymentMethods }
			/>
		</StylingSection>
	);
};

const SectionButtonLayout = ( { location } ) => {
	const { supportsLayout, layout, setLayout, layoutChoices } =
		useStylingProps( location );

	if ( ! supportsLayout ) {
		return null;
	}

	return (
		<StylingSection
			className="button-layout"
			title={ __( 'Button Layout', 'woocommerce-paypal-payments' ) }
		>
			<RadioControl
				className="ppcp-r__horizontal-control"
				options={ layoutChoices }
				selected={ layout }
				onChange={ setLayout }
			/>
		</StylingSection>
	);
};

const SectionButtonShape = ( { location } ) => {
	const { shape, setShape, shapeChoices } = useStylingProps( location );

	return (
		<StylingSection
			title={ __( 'Shape', 'woocommerce-paypal-payments' ) }
			className="button-shape"
		>
			<RadioControl
				className="ppcp-r__horizontal-control"
				options={ shapeChoices }
				selected={ shape }
				onChange={ setShape }
			/>
		</StylingSection>
	);
};

const SectionButtonLabel = ( { location } ) => {
	const { label, setLabel, labelChoices } = useStylingProps( location );

	return (
		<StylingSection>
			<SelectControl
				label={ __( 'Button Label', 'woocommerce-paypal-payments' ) }
				className="ppcp-r-styling__select"
				options={ labelChoices }
				value={ label }
				onChange={ setLabel }
			/>
		</StylingSection>
	);
};

const SectionButtonColor = ( { location } ) => {
	const { color, setColor, colorChoices } = useStylingProps( location );

	return (
		<StylingSection>
			<SelectControl
				label={ __( 'Button Color', 'woocommerce-paypal-payments' ) }
				className=" ppcp-r-styling__select"
				options={ colorChoices }
				value={ color }
				onChange={ setColor }
			/>
		</StylingSection>
	);
};

const SectionButtonTagline = ( { location } ) => {
	const { supportsTagline, tagline, setTagline, taglineChoices } =
		useStylingProps( location );

	if ( ! supportsTagline ) {
		return null;
	}

	return (
		<StylingSection
			title={ __( 'Tagline', 'woocommerce-paypal-payments' ) }
			className="tagline"
		>
			<PayPalCheckboxGroup
				value={ taglineChoices }
				currentValue={ tagline }
				changeCallback={ setTagline }
			/>
		</StylingSection>
	);
};
