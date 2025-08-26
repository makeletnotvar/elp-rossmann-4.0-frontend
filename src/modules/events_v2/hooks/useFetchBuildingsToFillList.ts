import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import { useEffect, useState } from 'react';

export const useFetchBuildingsToFillList = (uuid?: string | string[]) => {
	const [fetched, setFetched] = useState<boolean>(false);
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [data, setData] = useState<{ uuid: string; name: string }[]>([]);

	const getData = async () => {
		if (!uuid) return;

		setFetching(true);
		try {
			const response = await API.get(buildingsAPI.getBuildingsToFillList(uuid));
			setData(response.data.buildings);
			setFetched(true);
			setError(false);
		} catch (err) {
			setFetched(false);
			setError(true);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		getData();
	}, [uuid]);

	return {
		fetching,
		fetched,
		data,
		error,
		getData,
	};
};
