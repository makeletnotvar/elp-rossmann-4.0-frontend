import { FILTERS_VALUES } from 'modules/buildings/components/BuildingsListFilters/BuildingsListFiltersHooks';
import { buildingsActions } from 'modules/buildings/redux/buildings';
import { buildingsFiltersActions, useBuildingsFiltersState } from 'modules/buildings/redux/buildingsFilters';
import { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import { pointsActions } from 'modules/common/redux/points';
import { pollActions } from 'modules/common/redux/poll';
import { useAuth } from 'modules/common/selectors/auth';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useRouter from 'use-react-router';
import { uniqueArray } from '../../../../helpers/data';
import { getUserDefaultColumns } from './buildingsListTableConfig';

export interface BuidlingsListRoutingPagitnationProps {
	q?: string; // search query
	d?: 'asc' | 'desc'; // direction
	p?: string; // param name
	s?: number; // rows per page
	o?: number; // offset
	c?: string[]; // visible columns names

	[param: string]: any;
}

/**
 * It translate URL string to columns config making columns hidden by adding @hidden param
 *
 * @param columns
 * @param columnsIndexString
 */
const updateColumnsVisible = (columns: SuperTableDataColumns, activeColumnsNames: string[] = []): SuperTableDataColumns => {
	const nextColumns = { ...columns };

	if (activeColumnsNames.length > 0) {
		const allColumnsNames = Object.keys(nextColumns);

		allColumnsNames.forEach((columnName, index) => {
			columns[columnName].hidden = !activeColumnsNames.includes(columnName);
		});
	}

	return columns;
};

/**
 * Remove filters for query
 * Using for update url query when filters change
 *
 * @param routeProps
 */
const removeFiltersFromQueryParams = (routeProps: BuidlingsListRoutingPagitnationProps): BuidlingsListRoutingPagitnationProps => {
	return Object.keys(routeProps)
		.filter(param => param)
		.reduce(
			(ob, nextParam) => ({
				...ob,
				[nextParam]: routeProps[nextParam],
			}),
			{}
		);
};

export const BUILDING_TABLE_COLUMNS_LOCALSTORAGE_IDENTIFIER = '_B_T_C_';

export const useBuidlingsListPaginationRouter = () => {
	const {
		history,
		location: { search },
	} = useRouter();
	const { buildingsFilters, fetching: fetchingFilters } = useBuildingsFiltersState();
	const { user } = useAuth();
	const locationProps: BuidlingsListRoutingPagitnationProps = queryString.parse(search);
	const { columns, setColumnsVisibility } = useColumns(getUserDefaultColumns(user, buildingsFilters));

	const dispatch = useDispatch();

	const update = useCallback(
		(ob: BuidlingsListRoutingPagitnationProps) => {
			const currentRouteParamsWithoutFilters = removeFiltersFromQueryParams(locationProps);
			const searchQueryWasUpdated = ob.q != locationProps.q && ob.q !== undefined;
			const paramWasUpdated = ob.p != locationProps.p && ob.p !== undefined;
			const dirWasUpdated = ob.d != locationProps.d && ob.d !== undefined;
			const filterChanged = Object.keys(ob).some(key => key.startsWith('F_') && ob[key] !== locationProps[key]);
			let offset = ob.o;

			if (searchQueryWasUpdated || paramWasUpdated || dirWasUpdated || filterChanged) {
				offset = 0;
			}

			const nextSearch = mergeQueryParams<BuidlingsListRoutingPagitnationProps>(currentRouteParamsWithoutFilters, { ...ob, o: offset });
			const nextSearchString = queryString.stringify(nextSearch);
			const { c, ...nextSearchWithJustApiParams } = nextSearch;
			dispatch(buildingsActions.get.request(nextSearchWithJustApiParams as any, []));
			history.push(`/buildings/list/?${nextSearchString}`);
		},
		[search]
	);

	// Initialize empty config at first load
	useEffect(() => {
		update({});
		dispatch(buildingsFiltersActions.get.request());
	}, []);

	useEffect(() => {
		localStorage.setItem(BUILDING_TABLE_COLUMNS_LOCALSTORAGE_IDENTIFIER, JSON.stringify({ c: locationProps.c }));
	}, [locationProps.c]);

	return {
		q: locationProps.q || '',
		dir: (locationProps.d || 'desc') as 'asc' | 'desc',
		param: <string>(locationProps.p || ''),
		rowsPerPage: numQuery(locationProps.s, 20),
		offset: numQuery(locationProps.o, 0),
		update,
		columns: updateColumnsVisible(columns, locationProps.c),
		setColumnsVisibility,
		activeFilters: Object.entries(locationProps).filter(p => p[0].startsWith('F_')),
		fetchingFilters,
	};
};

export const useColumns = (defaultColumns: SuperTableDataColumns) => {
	const [columns, setColumns] = useState<SuperTableDataColumns>(defaultColumns);

	useEffect(() => {
		setColumns(defaultColumns);
	}, [JSON.stringify(defaultColumns)]);

	const setColumnsVisibility = useCallback(
		(activeColumns: string[]) => {
			const nextColumns: SuperTableDataColumns = Object.keys(columns).reduce(
				(cols, nextCol) => ({
					...cols,
					[nextCol]: {
						...columns[nextCol],
						hidden: !activeColumns.includes(nextCol),
					},
				}),
				{}
			);
			setColumns(nextColumns);
		},
		[columns]
	);

	return { columns, setColumnsVisibility };
};

export const getEmptyFilterParamsValues = () => {
	const filtersParamsNames = [...Object.keys(FILTERS_VALUES), 'comm', 'alarms'];
	return filtersParamsNames.reduce((ob, next) => ({ ...ob, ['F_' + next]: null }), {});
};

/**
 *
 * Get async columns with specified "async" property in config to provide polling values,
 * Ignore hidden columns
 *
 */
export const getAsyncColumns = (columns: SuperTableDataColumns): string[] => {
	return Object.keys(columns).reduce((allAsync: string[], next: string) => {
		const nextColumn = (columns as any)[next];
		const isAsyncVisibleColumn = nextColumn.async && !nextColumn.hidden;
		return isAsyncVisibleColumn ? [...allAsync, next] : allAsync;
	}, []);
};

function getTableVisibleRefsPointsUUIDs(buildings: Building[], columns: SuperTableDataColumns): string[] {
	const refColumnsNames = new Set<string>();

	// Collect all refs columns names
	Object.entries(columns).forEach(column => {
		const [columnName, columnConfig] = column;
		if (columnConfig.ref && !columnConfig.hidden) {
			refColumnsNames.add(columnName);
		}
	});

	// Iterate through buildings and collect all refs columns uuids
	const uuids = buildings.reduce((arr, nextBuilding) => {
		const refs = nextBuilding.pointsXidsRefs || {};
		const refsPointsUUIDs: string[] = Array.from(refColumnsNames)
			.map(columnName => refs[columnName])
			.filter(uuid => uuid !== undefined);

		return [...arr, ...refsPointsUUIDs];
	}, [] as string[]);

	return uniqueArray(uuids);
}

/**
 *
 *
 */
export const useBuildingsAsyncPoints = (buildings: Building[], columns: SuperTableDataColumns): void => {
	const dispatch = useDispatch();
	const columnsRefsPointsUUIDs = getTableVisibleRefsPointsUUIDs(buildings, columns);

	/**
	 *
	 * Time-cost memoized method
	 * Update on every buildings list or columns config change
	 *
	 */
	const asyncPointsUUIDS: string[] = useMemo(() => {
		const pointsUUIDS = new Set<string>();

		/**
		 * All async columns names (and exactly params names)
		 * It's automatically get from column config extended with no-table params like 'alarmsMaxPriority'
		 */
		const columnsWithSpecifiedAsyncParam = getAsyncColumns(columns);
		const additionalManualAsyncColumns = ['alarmsMaxPriority'];

		const asyncColumnsNames: string[] = [...columnsWithSpecifiedAsyncParam, ...additionalManualAsyncColumns];

		// Get all poinst uuids
		buildings.forEach(building => {
			asyncColumnsNames.map(columnName => (building as any)[columnName] || null).forEach(uuid => uuid !== null && pointsUUIDS.add(uuid));
		});

		// Get all buildings columns ref points uuids, and put it to whole collection
		if (columnsRefsPointsUUIDs.length > 0) {
			columnsRefsPointsUUIDs.forEach(uuid => {
				pointsUUIDS.add(uuid);
			});
		}

		return Array.from(pointsUUIDS);
	}, [buildings, columns]);

	/**
	 *
	 */
	useEffect(() => {
		const MERGE = true;
		const isRefsPointsExists = columnsRefsPointsUUIDs && columnsRefsPointsUUIDs.length > 0;

		if (isRefsPointsExists) {
			dispatch(pointsActions.get.request(columnsRefsPointsUUIDs, MERGE));
		}
	}, [columnsRefsPointsUUIDs]);

	/**
	 * Request on every points uuids list update,
	 * if list is empty reset poll
	 */
	useEffect(() => {
		if (asyncPointsUUIDS.length > 0) {
			dispatch(pollActions.poll.request(asyncPointsUUIDS));
		} else {
			dispatch(pollActions.poll.reset());
		}

		/**
		 * Reset poll when component's unmount
		 */
		return () => {
			dispatch(pollActions.poll.reset());
		};
	}, [asyncPointsUUIDS]);
};
