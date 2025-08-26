import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { mergeQueryParams } from 'modules/common/helpers/router/router';
import { filesActions } from 'modules/files/redux/files';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from 'react';
import useRouter from 'use-react-router';

export interface FilesListFilterRouteProps {
	path?: string;
	[param: string]: any;
}

function convertQueryToSettings(parsedQuery: any) {
	return {
		path: <string>(parsedQuery.path || ''),
	};
}

export function useFilesFilters() {
	const {
		history,
		location: { search },
	} = useRouter();
	const parsedQuery = useMemo(() => queryString.parse(search), [search]);
	const urlParams: FilesListFilterRouteProps = useMemo(() => convertQueryToSettings(parsedQuery), [parsedQuery]);
	const dispatch = useDispatch();

	const updateSettings = useCallback(
		(ob: FilesListFilterRouteProps) => {
			const nextSearch = mergeQueryParams(urlParams, ob);
			const nextSearchString = queryString.stringify(nextSearch);
			if (nextSearch.path) {
				dispatch(filesActions.getFiles.request(nextSearch.path));
			}
			history.push(`/files?${nextSearchString}`);
		},
		[urlParams]
	);

	useEffect(() => {
		if (urlParams.path) dispatch(filesActions.getFiles.request(urlParams.path));
	}, []);

	return {
		urlParams,
		updateSettings,
	};
}
