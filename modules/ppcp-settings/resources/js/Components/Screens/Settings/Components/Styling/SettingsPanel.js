import { __ } from '@wordpress/i18n';
import { RadioControl, SelectControl } from '@wordpress/components';

// Dummy hook.
import { useStylingLocation, useStylingProps } from '../../Tabs/TabStyling';

import { CheckboxGroup } from '../../../../ReusableComponents/Fields';
import HStack from '../../../../ReusableComponents/HStack';
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
			<HStack spacing={ 6 }>
				<CheckboxGroup
					options={ paymentMethodChoices }
					value={ paymentMethods }
					onChange={ setPaymentMethods }
				/>
			</HStack>
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
			<HStack>
				<RadioControl
					options={ layoutChoices }
					selected={ layout }
					onChange={ setLayout }
				/>
			</HStack>
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
			<HStack>
				<RadioControl
					options={ shapeChoices }
					selected={ shape }
					onChange={ setShape }
				/>
			</HStack>
		</StylingSection>
	);
};

const SectionButtonLabel = ( { location } ) => {
	const { label, setLabel, labelChoices } = useStylingProps( location );

	return (
		<StylingSection
			title={ __( 'Button Label', 'woocommerce-paypal-payments' ) }
			className="button-label"
		>
			<SelectControl
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
		<StylingSection
			title={ __( 'Button Color', 'woocommerce-paypal-payments' ) }
			className="button-color"
		>
			<SelectControl
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
			<HStack>
				<CheckboxGroup
					options={ taglineChoices }
					value={ tagline }
					onChange={ setTagline }
				/>
			</HStack>
		</StylingSection>
	);
};
