import { API } from 'api/axios';
import useSelector from 'modules/common/helpers/redux/useSelector';

import mapAPI from 'api/endpoints/mapAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { AnyAction, Dispatch } from 'redux';
import { MapRootState } from '.';

const MAP_PIN_DATA_MODULE = 'mapPin/data';

export interface MapPinDataResponse {
	pinDetails: MapBuildingPinDetails;
}

const REQUEST = MAP_PIN_DATA_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = MAP_PIN_DATA_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = MAP_PIN_DATA_MODULE + '_RESPONSE_FAILURE';
const FETCH = MAP_PIN_DATA_MODULE + '_FETCH';
const RESET = MAP_PIN_DATA_MODULE + '_RESET';

export interface MapPinDataState extends AsyncReducerState {
	pinDetails: MapBuildingPinDetails;
}

const initialState: MapPinDataState = {
	pinDetails: {} as MapBuildingPinDetails,
	...defaultAsyncReducerState,
};

const mapPinDataReducer = (state = initialState, action: AnyAction): MapPinDataState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, pinDetails: action.payload.details };
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getMapPinData: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<MapPinDataResponse>(mapAPI.getMapPinData(uuid));
				dispatch(actions.getMapPinData.success());
				dispatch(actions.getMapPinData.fetch(response.data));
			} catch (err) {
				dispatch(actions.getMapPinData.failure());
			}
		},
		fetch: (response: MapPinDataResponse): ReduxAction<MapPinDataResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
};

const selectMapPinData = (state: MapRootState): MapPinDataState => state.pinDetails;
export const useMapPinDataState = (): MapPinDataState => {
	return useSelector<MapRootState, MapPinDataState>(selectMapPinData);
};

export default mapPinDataReducer;
export const mapPinDataActions = actions;
