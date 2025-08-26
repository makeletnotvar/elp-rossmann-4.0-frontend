import { UI } from 'config/ui';
import queryString from 'query-string';
import { BuidlingsListRoutingPagitnationProps, BUILDING_TABLE_COLUMNS_LOCALSTORAGE_IDENTIFIER } from '../components/BuildingsList/BuildingsListHooks';

export function getDefaultBuildingsPath(): string {
	const config: Partial<BuidlingsListRoutingPagitnationProps> = {
		s: UI.TABLES.ROWS_PER_PAGE_DEFAULT_SELECTED,
		o: 0,
		c: [],
	};

	const columnsStoredConfig = localStorage.getItem(BUILDING_TABLE_COLUMNS_LOCALSTORAGE_IDENTIFIER);
	const parsedColumnsStoredConfig: any = columnsStoredConfig ? JSON.parse(columnsStoredConfig) || {} : {};

	if (parsedColumnsStoredConfig && parsedColumnsStoredConfig.c && parsedColumnsStoredConfig.c.length > 0) {
		config.c = parsedColumnsStoredConfig.c;
	}

	const path = `buildings/list/?${queryString.stringify(config)}`;
	return path;
}
