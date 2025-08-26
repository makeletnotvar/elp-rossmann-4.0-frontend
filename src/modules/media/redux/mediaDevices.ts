import { API } from 'api/axios';
import mediaAPI from 'api/endpoints/mediaAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { MediaRootState } from 'modules/media/redux';
import { AnyAction, Dispatch } from 'redux';

const MEDIA_DEVICE_DEVICES_MODULE = 'media/list';

export interface MediaDevicesResponse {
	mediaDevices: Device[];
	count: number;
	countAll: number;
}

const REQUEST = MEDIA_DEVICE_DEVICES_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = MEDIA_DEVICE_DEVICES_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = MEDIA_DEVICE_DEVICES_MODULE + '_RESPONSE_FAILURE';
const FETCH = MEDIA_DEVICE_DEVICES_MODULE + '_FETCH';
const RESET = MEDIA_DEVICE_DEVICES_MODULE + '_RESET';

export interface MediaDevicesState extends AsyncReducerState {
	mediaDevices: Device[];
	count: number;
	countAll: number;
}

const initialState: MediaDevicesState = {
	mediaDevices: [],
	count: -1,
	countAll: -1,
	...defaultAsyncReducerState,
};

const mediaDevicesReducer = (state = initialState, action: AnyAction): MediaDevicesState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, mediaDevices: action.payload.mediaDevices, count: action.payload.count, countAll: action.payload.countAll };
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getMediaDevices: {
		request: (deviceUUID: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<MediaDevicesResponse>(mediaAPI.getDevices(deviceUUID));
				dispatch(actions.getMediaDevices.success());
				dispatch(actions.getMediaDevices.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getMediaDevices.failure(err));
			}
		},
		fetch: (response: MediaDevicesResponse): ReduxAction<MediaDevicesResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
};

const selectMediaDevices = (state: MediaRootState): MediaDevicesState => state.mediaDevices;
export const useMediaDevicesState = (): MediaDevicesState => {
	return useSelector<MediaRootState, MediaDevicesState>(selectMediaDevices);
};

export default mediaDevicesReducer;
export const mediaDevicesActions = actions;
