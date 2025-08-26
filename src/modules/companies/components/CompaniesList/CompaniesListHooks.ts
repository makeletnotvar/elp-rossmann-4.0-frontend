import {} from 'modules/buildings/components/BuildingsList/BuildingsListHooks';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { convertPaginationRouteProps, mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import { companiesActions, useCompaniesState } from 'modules/companies/redux/companies';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from 'react';
import useRouter from 'use-react-router';

interface CompaniesListFilterRouteProps {
	q?: string;
	d?: 'asc' | 'desc';
	p?: string;
	s?: number;
	o?: number;
	c?: string;

	[param: string]: any;
}

export function useCompaniesFilters() {
	const {
		history,
		location: { search },
	} = useRouter();

	const parsedQuery = useMemo(() => queryString.parse(search), [search]);

	const updateSettings = useCallback(
		(ob: CompaniesListFilterRouteProps) => {
			const { path, ...nextSearch } = mergeQueryParams<CompaniesListFilterRouteProps>(parsedQuery, ob);
			const nextSearchString = queryString.stringify(nextSearch);
			history.push(`/companies?${nextSearchString}`);
		},
		[search]
	);

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

export function useCompaniesData(settings: CompaniesListFilterRouteProps) {
	const { companies, fetching, fetched, error, count, countAll } = useCompaniesState();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(companiesActions.getMany.request(settings || {}));
	}, [JSON.stringify(settings)]);

	return {
		companies,
		fetching,
		fetched,
		error,
		count,
		countAll,
	};
}
