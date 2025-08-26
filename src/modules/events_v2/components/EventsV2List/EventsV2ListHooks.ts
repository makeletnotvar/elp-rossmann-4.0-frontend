import { isEqual } from 'lodash';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { convertPaginationRouteProps, extractFiltersFromObject, mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import { eventsV2Actions } from 'modules/events_v2/redux/eventsV2';
import queryString from 'query-string';
import { useCallback, useEffect, useRef, useState } from 'react';
import useRouter from 'use-react-router';

interface EventsListFilterRouteProps {
	q?: string;
	d?: 'asc' | 'desc';
	p?: string;
	s?: number;
	o?: number;
	c?: string;

	[param: string]: any;
}

function convertQueryToSettings(parsedQuery: any) {
	return {
		query: String(parsedQuery.q || ''),
		sortingDir: <'asc' | 'desc'>(parsedQuery.d || 'desc'),
		sortingParam: <string>(parsedQuery.p || 'activeTs'),
		rowsPerPage: numQuery(parsedQuery.s, 20),
		offset: numQuery(parsedQuery.o, 0),
	};
}

interface Params {
	[key: string]: any;
}

const filterParams = (paramsA: Params, paramsB: Params): Params => {
	const paramsBKeys = new Set(Object.keys(paramsB));
	const filteredParams = Object.keys(paramsA)
		.filter(key => {
			return !key.startsWith('F_') || paramsBKeys.has(key);
		})
		.reduce((acc: Params, key: string) => {
			acc[key] = paramsA[key];
			return acc;
		}, {});
	return filteredParams;
};

export function useEventsFilters(tab: 'active' | 'history', buildingUUID?: string) {
	const {
		history,
		location: { search },
	} = useRouter();

	const [parsedQuery, setParsedQuery] = useState(queryString.parse(search));
	const [filters, setFilters] = useState<{ [param: string]: any }>(extractFiltersFromObject(parsedQuery));
	const [settings, setSettings] = useState<EventsListFilterRouteProps>(convertQueryToSettings(parsedQuery));
	const dispatch = useDispatch();
	const prevSettingsRef = useRef<any>(null);
	const prevFiltersRef = useRef<any>(null);
	const prevTabRef = useRef<any>(null);

	const updateSettings = useCallback(
		(ob: EventsListFilterRouteProps) => {
			const searchQueryWasUpdated = ob.q != settings.query && ob.q !== undefined;
			const rowsPerPageWasUpdated = ob.s != settings.rowsPerPage && ob.s !== undefined;
			const paramWasUpdated = ob.p != settings.sortingParam && ob.p !== undefined;
			const dirWasUpdated = ob.d != settings.sortingDir && ob.d !== undefined;
			const filterChanged = Object.keys(ob).some(key => key.startsWith('F_') && ob[key] !== filters[key]);
			let offset = ob.o;

			if (searchQueryWasUpdated || rowsPerPageWasUpdated || paramWasUpdated || dirWasUpdated || filterChanged) {
				offset = 0;
			}

			const nextSearch = mergeQueryParams(
				convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>, { ...filters, ...(buildingUUID && { F_building: buildingUUID }) }),
				{ ...ob, o: offset }
			);
			const nextSearchString = queryString.stringify(nextSearch);

			history.push(buildingUUID ? `/building/${buildingUUID}/events-v2/${tab}?${nextSearchString}` : `/events-v2/${tab}?${nextSearchString}`);
		},
		[settings, filters, buildingUUID]
	);

	useEffect(() => {
		setParsedQuery(queryString.parse(search));
	}, [search]);

	useEffect(() => {
		const nextSettings = convertQueryToSettings(parsedQuery);
		const nextFilters = {
			...extractFiltersFromObject(parsedQuery),
			...(buildingUUID && { F_building: buildingUUID }),
		};

		if (isEqual(prevSettingsRef.current, nextSettings) && isEqual(prevFiltersRef.current, nextFilters) && tab === prevTabRef.current) {
			return;
		}

		prevSettingsRef.current = nextSettings;
		prevFiltersRef.current = nextFilters;
		prevTabRef.current = tab;
		setSettings(nextSettings);
		setFilters(nextFilters);

		const routeProps = convertPaginationRouteProps(nextSettings as Partial<SuperTableDisplaySettings>, nextFilters);

		dispatch(eventsV2Actions.fetch({ ...routeProps, F_active: tab === 'active' ? true : false }));
	}, [parsedQuery, tab, buildingUUID]);

	return {
		settings,
		updateSettings,
		activeFilters: Object.entries(filters),
	};
}

export function useDetailedEventRoute(tab: 'active' | 'history', buildingUUID?: string) {
	const {
		history,
		location: { search },
		match: {
			params: { eventUUID, confirm },
		},
	} = useRouter<{ eventUUID?: string; confirm?: string }>();

	const setDetailedEvent = useCallback(
		(uuid: string | undefined) => {
			const nextURL = buildingUUID
				? `/building/${buildingUUID}/events-v2/${tab}${uuid ? '/' + uuid : ''}${search}`
				: `/events-v2/${tab}${uuid ? '/' + uuid : ''}${search}`;
			history.push(nextURL);
		},
		[search, tab]
	);

	return {
		detailedEventUUID: !confirm ? eventUUID : undefined,
		setDetailedEvent,
		closeDetailsHandler: () => setDetailedEvent(undefined),
	};
}

export function useConfirmEventRoute(tab: 'active' | 'history', buildingUUID?: string) {
	const {
		history,
		location: { search },
		match: {
			params: { eventUUID, confirm },
		},
	} = useRouter<{ eventUUID?: string; confirm?: string }>();

	const setConfirmEvent = useCallback(
		(uuid: string | undefined, confirm: string | undefined) => {
			const nextURL = buildingUUID
				? `/building/${buildingUUID}/events-v2/${tab}${uuid ? '/' + uuid : ''}${confirm ? '/' + confirm : ''}${search}`
				: `/events-v2/${tab}${uuid ? '/' + uuid : ''}${confirm ? '/' + confirm : ''}${search}`;
			history.push(nextURL);
		},
		[search, tab]
	);

	return {
		confirm: confirm ? eventUUID : undefined,
		setConfirmEvent,
		closeConfirmHandler: () => setConfirmEvent(undefined, undefined),
	};
}
