import { API } from 'api/axios';
import mapAPI from 'api/endpoints/mapAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';
import { MapRootState } from '.';

const MAP_PIN_DATA_MODULE = 'mapGroup/data';

export interface MapGroupDataResponse {
	groupDetails: MapBuildingPinDetails;
}

const REQUEST = MAP_PIN_DATA_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = MAP_PIN_DATA_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = MAP_PIN_DATA_MODULE + '_RESPONSE_FAILURE';
const FETCH = MAP_PIN_DATA_MODULE + '_FETCH';
const RESET = MAP_PIN_DATA_MODULE + '_RESET';

export interface MapGroupDataState extends AsyncReducerState {
	groupDetails: MapBuildingPinDetails;
}

const initialState: MapGroupDataState = {
	groupDetails: {} as MapBuildingPinDetails,
	...defaultAsyncReducerState,
};

const mapGroupDataReducer = (state = initialState, action: AnyAction): MapGroupDataState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, groupDetails: action.payload.details };
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getMapGroupData: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<MapGroupDataResponse>(mapAPI.getMapGroupData(uuid));
				dispatch(actions.getMapGroupData.success());
				dispatch(actions.getMapGroupData.fetch(response.data));
			} catch (err) {
				dispatch(actions.getMapGroupData.failure());
			}
		},
		fetch: (response: MapGroupDataResponse): ReduxAction<MapGroupDataResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
};

const selectMapGroupData = (state: MapRootState): MapGroupDataState => state.groupDetails;
export const useMapGroupDataState = (): MapGroupDataState => {
	return useSelector<MapRootState, MapGroupDataState>(selectMapGroupData);
};

export default mapGroupDataReducer;
export const mapGroupDataActions = actions;
