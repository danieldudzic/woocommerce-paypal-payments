import {
	LocationSelector,
	PaymentMethods,
	ButtonLayout,
	ButtonShape,
	ButtonLabel,
	ButtonColor,
} from './Content';

const SettingsPanel = ( { location, setLocation } ) => (
	<div className="settings-panel">
		<LocationSelector location={ location } setLocation={ setLocation } />
		<PaymentMethods location={ location } />
		<ButtonLayout location={ location } />
		<ButtonShape location={ location } />
		<ButtonLabel location={ location } />
		<ButtonColor location={ location } />
	</div>
);

export default SettingsPanel;
