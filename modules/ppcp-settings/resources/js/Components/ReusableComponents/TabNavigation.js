import { useCallback, useEffect, useState } from '@wordpress/element';

// TODO: Migrate to Tabs (TabPanel v2) once its API is publicly available, as it provides programmatic tab switching support: https://github.com/WordPress/gutenberg/issues/52997
import { TabPanel } from '@wordpress/components';

import { getQuery, updateQueryString } from '../../utils/navigation';

const TabNavigation = ( { tabs } ) => {
	const { panel } = getQuery();

	const isValidTab = ( tabsList, checkTab ) => {
		return tabsList.some( ( tab ) => tab.name === checkTab );
	};

	const getValidInitialPanel = () => {
		if ( ! panel || ! isValidTab( tabs, panel ) ) {
			return tabs[ 0 ].name;
		}
		return panel;
	};

	const [ activePanel, setActivePanel ] = useState( getValidInitialPanel );

	const updateActivePanel = useCallback(
		( tabName ) => {
			if ( isValidTab( tabs, tabName ) ) {
				setActivePanel( tabName );
			} else {
				console.warn( `Invalid tab name: ${ tabName }` );
			}
		},
		[ tabs ]
	);

	useEffect( () => {
		updateQueryString( { panel: activePanel } );
	}, [ activePanel ] );

	return (
		<TabPanel
			className={ `ppcp-r-tabs ${ activePanel }` }
			initialTabName={ activePanel }
			onSelect={ updateActivePanel }
			tabs={ tabs }
		>
			{ ( tab ) => {
				return tab.component || <>{ tab.title ?? tab.name }</>;
			} }
		</TabPanel>
	);
};

export default TabNavigation;
