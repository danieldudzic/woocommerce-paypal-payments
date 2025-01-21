import ConnectionStatus from './TabSettingsElements/ConnectionStatus';
import CommonSettings from './TabSettingsElements/CommonSettings';
import ExpertSettings from './TabSettingsElements/ExpertSettings';
import { SettingsHooks } from '../../../data';

const TabSettings = () => {
	const { settings, setSettings } = SettingsHooks.useSettings();

	const updateFormValue = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

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
