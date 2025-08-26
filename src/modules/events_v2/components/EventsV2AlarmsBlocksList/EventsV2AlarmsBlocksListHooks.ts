import { isEqual } from 'lodash';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { convertPaginationRouteProps, extractFiltersFromObject, mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import { alarmsBlocksActions } from 'modules/events_v2/redux/alarmsBlocks';
import queryString from 'query-string';
import { useCallback, useEffect, useRef, useState } from 'react';
import useRouter from 'use-react-router';

export interface EventsAlarmsBlocksListFilterRouteProps {
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
		q: String(parsedQuery.q || ''),
		sortingDir: <'asc' | 'desc'>(parsedQuery.d || 'desc'),
		sortingParam: <string>(parsedQuery.p || 'lastOccurTs'),
		rowsPerPage: numQuery(parsedQuery.s, 20),
		offset: numQuery(parsedQuery.o, 0),
	};
}

export function useEventsAlarmsBlocksFilters(buildingUUID?: string) {
	const {
		history,
		location: { search },
	} = useRouter();

	const [parsedQuery, setParsedQuery] = useState(queryString.parse(search));
	const [filters, setFilters] = useState<{ [param: string]: any }>(extractFiltersFromObject(parsedQuery));
	const [settings, setSettings] = useState<EventsAlarmsBlocksListFilterRouteProps>(convertQueryToSettings(parsedQuery));
	const dispatch = useDispatch();
	const prevSettingsRef = useRef<any>(null);
	const prevFiltersRef = useRef<any>(null);

	const updateSettings = useCallback(
		(ob: EventsAlarmsBlocksListFilterRouteProps) => {
			const nextSearch = mergeQueryParams(
				convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>, { ...filters, ...(buildingUUID && { F_building: buildingUUID }) }),
				ob
			);
			const nextSearchString = queryString.stringify(nextSearch);
			history.push(buildingUUID ? `/building/${buildingUUID}/events-v2/confirmed?${nextSearchString}` : `/events-v2/confirmed?${nextSearchString}`);
		},
		[settings, filters, buildingUUID]
	);

	useEffect(() => {
		setParsedQuery(queryString.parse(search));
	}, [search]);

	useEffect(() => {
		const nextSettings = convertQueryToSettings(parsedQuery);
		const nextFilters = { ...extractFiltersFromObject(parsedQuery), ...(buildingUUID && { F_building: buildingUUID }) };

		if (isEqual(prevSettingsRef.current, nextSettings) && isEqual(prevFiltersRef.current, nextFilters)) {
			return;
		}

		prevSettingsRef.current = nextSettings;
		prevFiltersRef.current = nextFilters;
		setSettings(nextSettings);
		setFilters(nextFilters);

		const routeProps = convertPaginationRouteProps(nextSettings as Partial<SuperTableDisplaySettings>, nextFilters);

		dispatch(alarmsBlocksActions.fetch(routeProps));
	}, [parsedQuery, buildingUUID]);

	return {
		settings,
		updateSettings,
		activeFilters: Object.entries(filters),
	};
}

export function useDetailedEventAlarmBlockRoute(buildingUUID?: string) {
	const {
		history,
		location: { search },
		match: {
			params: { code },
		},
	} = useRouter<{ code: string }>();

	const setDetailedEventAlarmBlock = useCallback(
		(code: string | undefined) => {
			const nextURL = buildingUUID
				? `/building/${buildingUUID}/events-v2/confirmed${code ? '/' + code : ''}${search}`
				: `/events-v2/confirmed${code ? '/' + code : ''}${search}`;
			history.push(nextURL);
		},
		[search]
	);

	return {
		detailedEventAlarmBlockCode: code || undefined,
		setDetailedEventAlarmBlock,
		closeDetailsHandler: () => setDetailedEventAlarmBlock(undefined),
	};
}
