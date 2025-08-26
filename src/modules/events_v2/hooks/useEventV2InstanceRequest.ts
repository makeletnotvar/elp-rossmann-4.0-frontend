/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useEffect } from 'react';
import { eventV2InstanceActions, useEventV2InstanceState } from '../redux/instance';

export function useEventV2InstanceRequest(eventUUID?: string | null) {
	const { event, fetching, fetched, error } = useEventV2InstanceState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (eventUUID) {
			dispatch(eventV2InstanceActions.getEventInstance.request(eventUUID));
		}
	}, [eventUUID]);

	const statusEventInstance = { isFetching: fetching, isSuccess: fetched, isError: error };

	return {
		eventInstance: event,
		statusEventInstance,
	};
}
