import Container from '../../ReusableComponents/Container';
import TabNavigation from '../../ReusableComponents/TabNavigation';
import { getSettingsTabs } from './Tabs';
import SettingsNavigation from './Components/Navigation';

const SettingsScreen = () => {
	const tabs = getSettingsTabs();

	return (
		<>
			<SettingsNavigation />
			<Container page="settings">
				<TabNavigation tabs={ tabs }></TabNavigation>
			</Container>
		</>
	);
};

export default SettingsScreen;
