import ConnectionStatus from './TabSettingsElements/ConnectionStatus';
import CommonSettings from './TabSettingsElements/CommonSettings';
import ExpertSettings from './TabSettingsElements/ExpertSettings';
import { useSettings } from '../../../data/settings-tab/hooks';

const TabSettings = () => {
	const { settings, setSettings } = useSettings();

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
