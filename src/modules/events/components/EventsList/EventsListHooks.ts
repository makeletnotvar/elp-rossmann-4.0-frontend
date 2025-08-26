import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { convertPaginationRouteProps, extractFiltersFromObject, mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import { eventsActions } from 'modules/events/redux/events';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from 'react';
import useRouter from 'use-react-router';

interface EventsListFilterRouteProps {
	q?: string; // search query
	d?: 'asc' | 'desc'; // direction
	p?: string; // param name
	s?: number; // rows per page
	o?: number; // offset
	c?: string; // visible columns indexes

	[param: string]: any;
}

function convertQueryToSettings(parsedQuery: any, filters: any) {
	return {
		q: String(parsedQuery.q || ''),
		sortingDir: <'asc' | 'desc'>(parsedQuery.d || 'desc'),
		sortingParam: <string>(parsedQuery.p || 'activeTs'),
		rowsPerPage: numQuery(parsedQuery.s, 20),
		offset: numQuery(parsedQuery.o, 0),
	};
}

export function useEventsFilters() {
	const {
		history,
		location: { search },
	} = useRouter();
	// Current url props as object
	const parsedQuery = useMemo(() => queryString.parse(search), [search]);
	// All filters (props with name started with "F_")
	const filters: { [param: string]: any } = useMemo(() => extractFiltersFromObject(parsedQuery), [parsedQuery]);
	// All pagination and sorting props
	const settings: EventsListFilterRouteProps = useMemo(() => convertQueryToSettings(parsedQuery, filters), [parsedQuery, filters]);
	const dispatch = useDispatch();

	// Update settings handler, called on every pagination/filter/sorting param change by user
	const updateSettings = useCallback(
		(ob: EventsListFilterRouteProps) => {
			const nextSearch = mergeQueryParams(convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>, filters), ob);
			const nextSearchString = queryString.stringify(nextSearch);
			history.push(`/events/list/?${nextSearchString}`);
		},
		[settings, filters]
	);

	// Keep updated filters and settings, dispatch API request if parsedQuery change
	useEffect(() => {
		const routeProps = convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>, filters);
		dispatch(eventsActions.fetch(routeProps));
	}, [settings, filters]);

	return {
		settings,
		updateSettings,
		activeFilters: Object.entries(filters),
	};
}

export function useDetailedEventRoute() {
	const {
		history,
		location: { search },
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();

	// Set detailed event by adding it's uuid in URL
	const setDetailedEvent = useCallback(
		(uuid: string | undefined) => {
			const nextURL = `/events/${uuid || ''}${search}`;
			history.push(nextURL);
		},
		[search]
	);

	return {
		detailedEventUUID: uuid || undefined,
		setDetailedEvent,
		closeDetailsHandler: () => setDetailedEvent(undefined),
	};
}
