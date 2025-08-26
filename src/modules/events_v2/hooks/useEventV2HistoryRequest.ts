/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useEffect } from 'react';
import { eventV2HistoryActions, useEventV2HistoryState } from '../redux/history';

export function useEventV2HistoryRequest(params?: { eventUUID: string | null; alarmCode: string | null; deviceUUID: string | null }) {
	const { event, fetching, fetched, error } = useEventV2HistoryState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (params?.eventUUID && params.deviceUUID && params.alarmCode) {
			dispatch(eventV2HistoryActions.getEventV2History.request(params));
		}
	}, [params]);

	const statusEventHistory = { isFetching: fetching, isSuccess: fetched, isError: error };

	return {
		eventHistory: event,
		statusEventHistory,
	};
}
