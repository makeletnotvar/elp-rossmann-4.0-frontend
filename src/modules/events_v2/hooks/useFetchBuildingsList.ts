import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export const useFetchBuildingsList = (q: string) => {
	const [fetched, setFetched] = useState<boolean>(false);
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [data, setData] = useState<{ uuid: string; name: string }[]>([]);

	const debouncedFetch = useCallback(
		debounce(async (query: string) => {
			try {
				const response = await API.get(buildingsAPI.getBuildingsListV2(query));
				setData(response.data.buildings);
				setFetched(true);
				setError(false);
			} catch (err) {
				setFetched(false);
				setError(true);
			} finally {
				setFetching(false);
			}
		}, 1000),
		[]
	);

	useEffect(() => {
		setFetching(true);
		debouncedFetch(q);
		return () => {
			debouncedFetch.cancel();
		};
	}, [q, debouncedFetch]);

	return {
		fetching,
		fetched,
		data,
		error,
	};
};
