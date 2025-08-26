import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps, mergeQueryParams } from 'modules/common/helpers/router/router';
import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import useRouter from 'use-react-router';

export interface AlarmsConfigListFilterRouteProps {
	d?: 'asc' | 'desc';
	p?: string;

	[param: string]: any;
}

function convertQueryToSettings(parsedQuery: any) {
	return {
		sortingDir: parsedQuery.d || 'asc',
		sortingParam: parsedQuery.p || 'code',
	};
}

export function useAlarmsConfigFilters() {
	const {
		history,
		location: { search },
	} = useRouter();
	const parsedQuery = useMemo(() => queryString.parse(search), [search]);
	const settings: AlarmsConfigListFilterRouteProps = useMemo(() => convertQueryToSettings(parsedQuery), [parsedQuery]);

	const updateSettings = useCallback(
		(ob: AlarmsConfigListFilterRouteProps) => {
			const nextSearch = mergeQueryParams(convertPaginationRouteProps(settings as Partial<SuperTableDisplaySettings>), ob);
			const nextSearchString = queryString.stringify(nextSearch);
			history.push(`/alarmsConfig?${nextSearchString}`);
		},
		[settings]
	);

	return {
		settings,
		updateSettings,
	};
}
