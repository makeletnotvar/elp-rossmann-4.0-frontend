import {} from 'modules/buildings/components/BuildingsList/BuildingsListHooks';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { convertPaginationRouteProps, mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import { devicesActions, useDevicesState } from 'modules/devices/redux/devices';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useRouter from 'use-react-router';

interface DeviceListFilterRouteProps {
	q?: string; // search query
	d?: 'asc' | 'desc'; // direction
	p?: string; // param name
	s?: number; // rows per page
	o?: number; // offset
	c?: string; // visible columns indexes

	[param: string]: any;
}

export function useDevicesFilters() {
	const {
		history,
		location: { search },
	} = useRouter();

	const parsedQuery = useMemo(() => queryString.parse(search), [search]);

	const updateSettings = useCallback(
		(ob: DeviceListFilterRouteProps) => {
			const { path, ...nextSearch } = mergeQueryParams<DeviceListFilterRouteProps>(parsedQuery, ob);
			const nextSearchString = queryString.stringify(nextSearch);
			history.push(`/devices/list?${nextSearchString}`);
		},
		[search]
	);

	// Memoized settings
	const settings = useMemo(
		() => ({
			query: String(parsedQuery.q || ''),
			sortingDir: <'asc' | 'desc'>(parsedQuery.d || 'asc'),
			sortingParam: <string>(parsedQuery.p || ''),
			rowsPerPage: numQuery(parsedQuery.s, 20),
			offset: numQuery(parsedQuery.o, 0),
		}),
		[parsedQuery]
	);

	const shortSettings = useMemo(() => convertPaginationRouteProps({ ...settings, query: settings.query }), [settings]);

	return {
		settings,
		shortSettings,
		updateSettings,
	};
}

export function useDevicesData(settings: DeviceListFilterRouteProps) {
	const {
		data: { devices, count, countAll },
		status,
	} = useDevicesState();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(devicesActions.fetch(settings || {}));
	}, [JSON.stringify(settings)]);

	return {
		devices,
		status,
		count,
		countAll,
	};
}

export function useAddDeviceDialog() {
	const [open, setOpen] = useState<boolean>(false);

	return {
		open,
		closeHandler: () => setOpen(false),
		openHandler: () => setOpen(true),
	};
}
