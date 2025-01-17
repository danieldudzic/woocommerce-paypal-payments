import { StylingHooks } from '../../../../data';
import PreviewPanel from '../Components/Styling/PreviewPanel';
import SettingsPanel from '../Components/Styling/SettingsPanel';

const TabStyling = () => {
	const { location, setLocation } = StylingHooks.useStylingLocation();

	return (
		<div className="ppcp-r-styling">
			<SettingsPanel location={ location } setLocation={ setLocation } />
			<PreviewPanel location={ location } />
		</div>
	);
};

export default TabStyling;
