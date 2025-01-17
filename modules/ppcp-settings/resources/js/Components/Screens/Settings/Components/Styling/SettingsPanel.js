import { StylingHooks } from '../../../../../data';
import {
	LocationSelector,
	PaymentMethods,
	ButtonLayout,
	ButtonShape,
	ButtonLabel,
	ButtonColor,
	Tagline,
} from './Content';

const SettingsPanel = () => {
	const { location, setLocation } = StylingHooks.useStylingLocation();

	return (
		<div className="settings-panel">
			<LocationSelector
				location={ location }
				setLocation={ setLocation }
			/>
			<PaymentMethods location={ location } />
			<ButtonLayout location={ location } />
			<ButtonShape location={ location } />
			<ButtonLabel location={ location } />
			<ButtonColor location={ location } />
			<Tagline location={ location } />
		</div>
	);
};

export default SettingsPanel;
