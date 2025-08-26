/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useCallback } from 'react';
import { eventV2HeatmapsActions, EventV2HeatmapsRequestParams, useEventV2HeatmapsState } from '../redux/heatmaps';

export function useEventV2HeatmapsRequest() {
	const { data, fetching, fetched, error } = useEventV2HeatmapsState();
	const dispatch = useDispatch();

	const generateHandler = useCallback((params: EventV2HeatmapsRequestParams) => {
		const deviceExists = Boolean(params.deviceUUID);
		const alarmCodeExists = Boolean(params.alarmCode);

		if (deviceExists && alarmCodeExists) {
			dispatch(eventV2HeatmapsActions.getEventV2Heatmaps.request(params));
		}
	}, []);

	const statusHeatmaps = { isFetching: fetching, isSuccess: fetched, isError: error };

	return {
		heatmaps: data || [],
		statusHeatmaps,
		generateHandler,
	};
}
