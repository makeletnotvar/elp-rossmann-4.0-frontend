import { API } from 'api/axios';
import mediaAPI from 'api/endpoints/mediaAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { MediaRootState } from 'modules/media/redux';
import { AnyAction, Dispatch } from 'redux';

const MEDIA_DEVICE_DATA_MODULE = 'media/data';

export interface MediaDeviceDataResponse {
	data: MediaPointsData;
}

const REQUEST = MEDIA_DEVICE_DATA_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = MEDIA_DEVICE_DATA_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = MEDIA_DEVICE_DATA_MODULE + '_RESPONSE_FAILURE';
const FETCH = MEDIA_DEVICE_DATA_MODULE + '_FETCH';
const RESET = MEDIA_DEVICE_DATA_MODULE + '_RESET';

export interface MediaDeviceDataState extends AsyncReducerState {
	data: MediaPointsData;
}

const initialState: MediaDeviceDataState = {
	data: {},
	...defaultAsyncReducerState,
};

const mediaDeviceDataReducer = (state = initialState, action: AnyAction): MediaDeviceDataState => {
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
	getDevicePointData: {
		request: (settings: MediaParamsRequestSettings) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<MediaDeviceDataResponse>(mediaAPI.getDevicePointData(settings));
				dispatch(actions.getDevicePointData.success());
				dispatch(actions.getDevicePointData.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getDevicePointData.failure(err));
			}
		},
		fetch: (response: MediaDeviceDataResponse): ReduxAction<MediaDeviceDataResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
	resetDevicePointData: {
		request: () => async (dispatch: Dispatch<any>) => {
			dispatch({ type: RESET });
		},
	},
};

const selectMediaDeviceData = (state: MediaRootState): MediaDeviceDataState => state.data;
export const useMediaDeviceDataState = (): MediaDeviceDataState => {
	return useSelector<MediaRootState, MediaDeviceDataState>(selectMediaDeviceData);
};

export default mediaDeviceDataReducer;
export const mediaDeviceDataActions = actions;
