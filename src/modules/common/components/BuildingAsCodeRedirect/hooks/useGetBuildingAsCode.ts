import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import { useEffect, useState } from 'react';

export function useGetBuildingAsCode(code: string) {
	const [responseStatus, setResponseStatus] = useState<{ isLoading: boolean; isSuccess: boolean; isError: boolean }>({
		isLoading: true,
		isSuccess: false,
		isError: false,
	});
	const [uuid, setUUID] = useState<string | null | undefined>();
	const [path, setPath] = useState<string | null>(null);

	useEffect(() => {
		const getBuildingAsCode = async () => {
			try {
				const response = await API.get<{ uuid: string }>(buildingsAPI.getBuildingAsCode(code));
				setUUID(response.data.uuid);
			} catch (err) {
				setResponseStatus({ isLoading: false, isSuccess: false, isError: true });
			} finally {
				setResponseStatus({ isLoading: false, isSuccess: true, isError: false });
			}
		};
		getBuildingAsCode();
	}, [code]);

	useEffect(() => {
		if (!responseStatus.isError && !responseStatus.isLoading && responseStatus.isSuccess && uuid !== null) {
			setPath(`/building/${uuid}/info`);
		} else if (responseStatus.isError || (!responseStatus.isLoading && uuid === null)) {
			setPath('/buildings');
		} else {
			setPath(null);
		}
	}, [responseStatus, uuid]);

	return { path };
}
