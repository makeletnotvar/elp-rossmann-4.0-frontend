import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import { useEffect, useState } from 'react';

export const useFetchUnitXidsList = (uuid?: string | string[]) => {
	const [fetched, setFetched] = useState<boolean>(false);
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [data, setData] = useState<{ xid: string; name: string }[]>([]);

	const getData = async (uuid?: string | string[]) => {
		setFetching(true);
		try {
			if ((Array.isArray(uuid) && uuid.length === 1) || (!Array.isArray(uuid) && uuid)) {
				const response = await API.get(eventsApi.getUnitXidsList(Array.isArray(uuid) ? uuid[0] : uuid));
				setData(response.data);
				setFetched(true);
			}
		} catch (err) {
			setFetched(false);
			setError(true);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		getData(uuid);
	}, [uuid]);

	return {
		fetching,
		fetched,
		data,
		error,
	};
};
