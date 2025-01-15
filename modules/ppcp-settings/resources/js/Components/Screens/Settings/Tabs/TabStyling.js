import { useState } from '@wordpress/element';

import { defaultLocationSettings } from '../../../../data/settings/tab-styling-data';

import PreviewPanel from '../Components/Styling/PreviewPanel';
import SettingsPanel from '../Components/Styling/SettingsPanel';

const TabStyling = () => {
	const [ locationSettings, setLocationSettings ] = useState( {
		...defaultLocationSettings,
	} );

	return (
		<div className="ppcp-r-styling">
			<SettingsPanel />

			<PreviewPanel settings={ locationSettings.settings } />
		</div>
	);
};

export default TabStyling;
