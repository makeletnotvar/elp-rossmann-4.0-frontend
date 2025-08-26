import { countArraysCommonItems, filterObjectProps } from 'helpers/data';
import { DEFAULT_VISIBLE_COLUMNS_LIST } from 'modules/buildings/components/BuildingsList/buildingsListTableConfig';
import { useBuildingsFiltersState } from 'modules/buildings/redux/buildingsFilters';
import { SuperTableDataColumn, SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useAuth } from 'modules/common/selectors/auth';
import { useCallback, useState } from 'react';

export function useTableColumnsConfig(columns: SuperTableDataColumns) {
	const { user } = useAuth();
	const { buildingsFilters } = useBuildingsFiltersState();
	const initialActiveColumnsNames: string[] = filterVisibleColumns(columns);
	const [activeColumns, setColumns] = useState(initialActiveColumnsNames);

	const toggleColumn = useCallback(
		(column: string, nextState: boolean) => {
			const nextColumns = nextState === true ? [...activeColumns, column] : activeColumns.filter(c => c !== column);
			setColumns(nextColumns);
		},
		[initialActiveColumnsNames]
	);

	const restoreDefaults = useCallback(() => {
		setColumns(DEFAULT_VISIBLE_COLUMNS_LIST(user, buildingsFilters));
	}, [initialActiveColumnsNames, buildingsFilters]);

	return {
		activeColumns,
		toggleColumn,
		restoreDefaults,
	};
}

export function filterVisibleColumns(columns: SuperTableDataColumns): string[] {
	return Object.keys(columns).filter(column => !columns[column].hidden);
}

export function useSplitedColumnsConfig(columns: SuperTableDataColumns, activeColumns: string[]) {
	const refColumns = filterObjectProps<SuperTableDataColumn>(columns, column => Boolean(column.ref));
	const refActiveColumnsCount = countArraysCommonItems(activeColumns, Object.keys(refColumns));
	const noRefColumns = filterObjectProps<SuperTableDataColumn>(columns, column => !column.ref);
	const noRefActiveColumnsCount = countArraysCommonItems(activeColumns, Object.keys(noRefColumns));

	return {
		refColumns,
		refActiveColumnsCount,
		noRefColumns,
		noRefActiveColumnsCount,
	};
}
