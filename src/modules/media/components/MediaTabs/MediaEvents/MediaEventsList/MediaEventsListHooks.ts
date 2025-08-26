import { SuperTableDisplaySettings } from "modules/common/components/Layout/SuperTable/SuperTable";
import { useDispatch } from "modules/common/helpers/redux/useActions";
import { convertPaginationRouteProps, extractFiltersFromObject, mergeQueryParams, numQuery } from "modules/common/helpers/router/router";
import { mediaEventsActions } from 'modules/media/redux/mediaEvents';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from "react";
import useRouter from "use-react-router";

interface MediaEventsListFilterRouteProps {
    q?: string;                 // search query
    d?: 'asc' | 'desc';       // direction
    p?: string;                 // param name
    s?: number;                 // rows per page
    o?: number;                 // offset
    c?: string;               // visible columns indexes

    [param: string]: any;
}

function convertQueryToSettings(parsedQuery: any, filters: any) {
    return {
        q: String(parsedQuery.q || ''),
        sortingDir: <'asc' | 'desc'>(parsedQuery.d || 'desc'),
        sortingParam: <string>(parsedQuery.p || 'activeTs'),
        rowsPerPage: numQuery(parsedQuery.s, 20),
        offset: numQuery(parsedQuery.o, 0),
    }
}

export function useMediaEventsFilters() {
    const { history, location: { search }, match: { params: { deviceUUID } } } = useRouter<{ deviceUUID: string }>();
    // Current url props as object
    const parsedQuery = useMemo(() => queryString.parse(search), [search]);
    // All filters (props with name started with "F_")
    const filters: { [param: string]: any } = useMemo(() => extractFiltersFromObject(parsedQuery), [parsedQuery]);
    // All pagination and sorting props
    const settings: MediaEventsListFilterRouteProps = useMemo(() => convertQueryToSettings(parsedQuery, filters), [parsedQuery, filters]);
    const dispatch = useDispatch();

    // Update settings handler, called on every pagination/filter/sorting param change by user
    const updateSettings = useCallback((ob: MediaEventsListFilterRouteProps) => {
        const nextSearch = mergeQueryParams(convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>, filters), ob);
        const nextSearchString = queryString.stringify(nextSearch);
        history.push(`/media/${deviceUUID}/events/?${nextSearchString}`);
    }, [settings, filters]);

    // Keep updated filters and settings, dispatch API request if parsedQuery change
    useEffect(() => {
        const routeProps = convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>, filters);
        dispatch(mediaEventsActions.fetch({deviceUUID, routeProps})); 
    }, [settings, filters, deviceUUID]);

    return {
        settings,
        updateSettings,
        activeFilters: Object.entries(filters)
    }
}

export function useDetailedMediaEventRoute() {
    const { history, location: { search }, match: { params: { deviceUUID, mediaEventUUID } } } = useRouter<{ deviceUUID: string, mediaEventUUID: string }>();

    // Set detailed event by adding it's mediaEventUUID in URL
    const setDetailedMediaEvent = useCallback((mediaEventUUID: string | undefined) => {
        const nextURL = `/media/${deviceUUID}/events/${mediaEventUUID || ''}${search}`;
        history.push(nextURL);
    }, [search]);

    return {
        detailedMediaEventUUID: mediaEventUUID || undefined,
        setDetailedMediaEvent,
        closeDetailsHandler: () => setDetailedMediaEvent(undefined)
    }
}