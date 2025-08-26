import { API } from 'api/axios';
import mediaAPI from 'api/endpoints/mediaAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { MediaRootState } from 'modules/media/redux';
import { AnyAction, Dispatch } from 'redux';

const MEDIA_DEVICE_CONSUMPTION_DATA_MODULE = 'media/consumptionData';

export interface MediaDeviceConsumptionDataResponse {
	consumptionData: MediaConsumptionData | null;
}

const REQUEST = MEDIA_DEVICE_CONSUMPTION_DATA_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = MEDIA_DEVICE_CONSUMPTION_DATA_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = MEDIA_DEVICE_CONSUMPTION_DATA_MODULE + '_RESPONSE_FAILURE';
const FETCH = MEDIA_DEVICE_CONSUMPTION_DATA_MODULE + '_FETCH';
const RESET = MEDIA_DEVICE_CONSUMPTION_DATA_MODULE + '_RESET';

export interface MediaDeviceConsumptionDataState extends AsyncReducerState {
	consumptionData: MediaConsumptionData;
}

const initialState: MediaDeviceConsumptionDataState = {
	consumptionData: {
		name: '',
		uuid: '',
		values: [],
	},
	...defaultAsyncReducerState,
};

const mediaDeviceConsumptionDataReducer = (state = initialState, action: AnyAction): MediaDeviceConsumptionDataState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, consumptionData: action.payload.data };
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getDevicePointConsumptionsData: {
		request: (settings: MediaConsumptionsRequestSettings) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<MediaDeviceConsumptionDataResponse>(mediaAPI.getDevicePointConsumptionsData(settings));

				dispatch(actions.getDevicePointConsumptionsData.success());
				dispatch(actions.getDevicePointConsumptionsData.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getDevicePointConsumptionsData.failure(err));
			}
		},
		fetch: (response: MediaDeviceConsumptionDataResponse): ReduxAction<MediaDeviceConsumptionDataResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
	resetDevicePointConsumptionsData: {
		request: () => async (dispatch: Dispatch<any>) => {
			dispatch({ type: RESET });
		},
	},
};

const selectMediaDeviceConsumptionData = (state: MediaRootState): MediaDeviceConsumptionDataState => state.consumptionData;
export const useMediaDeviceConsumptionDataState = (): MediaDeviceConsumptionDataState => {
	return useSelector<MediaRootState, MediaDeviceConsumptionDataState>(selectMediaDeviceConsumptionData);
};

export default mediaDeviceConsumptionDataReducer;
export const mediaDeviceConsumptionDataActions = actions;
