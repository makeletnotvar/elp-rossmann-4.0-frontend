import { API } from 'api/axios';
import useSelector from 'modules/common/helpers/redux/useSelector';

import mapAPI from 'api/endpoints/mapAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useInterval from 'modules/common/hooks/useInterval';
import { useDispatch } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';
import { MapRootState } from '.';
import { TriggerMapDataProps } from '../hooks/useMapData';

const MAP_DATA_MODULE = 'map/data';

export interface MapDataResponse {
	data: {
		groups: MapBuildingGroupPin[];
		pins: MapBuildingPin[];
	};
}

const REQUEST = MAP_DATA_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = MAP_DATA_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = MAP_DATA_MODULE + '_RESPONSE_FAILURE';
const FETCH = MAP_DATA_MODULE + '_FETCH';
const RESET = MAP_DATA_MODULE + '_RESET';

export interface MapDataState extends AsyncReducerState {
	data: {
		groups: MapBuildingGroupPin[];
		pins: MapBuildingPin[];
		stats: MapBuildingStats;
	};
}

const initialState: MapDataState = {
	data: {
		groups: [] as MapBuildingGroupPin[],
		pins: [] as MapBuildingPin[],
		stats: {} as MapBuildingStats,
	},
	...defaultAsyncReducerState,
};

const mapDataReducer = (state = initialState, action: AnyAction): MapDataState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, data: action.payload.data };
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getMapData: {
		request: (settings: TriggerMapDataProps) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<MapDataResponse>(mapAPI.getMapData(settings));
				dispatch(actions.getMapData.success());
				dispatch(actions.getMapData.fetch(response.data));
			} catch (err) {
				dispatch(actions.getMapData.failure());
			}
		},
		fetch: (response: MapDataResponse): ReduxAction<MapDataResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
};

const selectMapData = (state: MapRootState): MapDataState => state.map;
export const useMapDataState = (): MapDataState => {
	return useSelector<MapRootState, MapDataState>(selectMapData);
};

export default mapDataReducer;
export const mapDataActions = actions;

export const useMapPolling = (settings: TriggerMapDataProps, delay: number = 15000) => {
	const dispatch = useDispatch();
	useInterval(() => {
		dispatch(mapDataActions.getMapData.request(settings));
	}, delay);
};
