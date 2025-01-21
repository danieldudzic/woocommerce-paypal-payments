import ConnectionStatus from './TabSettingsElements/ConnectionStatus';
import CommonSettings from './TabSettingsElements/CommonSettings';
import ExpertSettings from './TabSettingsElements/ExpertSettings';
import { SettingsHooks } from '../../../data';
import SpinnerOverlay from '../../ReusableComponents/SpinnerOverlay';

const TabSettings = () => {
	const { isReady } = SettingsHooks.useStore();
	const { settings, setSettings } = SettingsHooks.useSettings();

	const updateFormValue = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	if ( ! isReady ) {
		return <SpinnerOverlay />;
	}

	return (
		<>
			<div className="ppcp-r-settings">
				<ConnectionStatus />
				<CommonSettings
					settings={ settings }
					updateFormValue={ updateFormValue }
				/>
				<ExpertSettings
					settings={ settings }
					updateFormValue={ updateFormValue }
				/>
			</div>
		</>
	);
};

export default TabSettings;
