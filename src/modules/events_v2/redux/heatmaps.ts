import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';
import { EventV2HeatmapsRootState } from '.';

const HEATMAPS_MODULE = 'heatmaps/heatmaps';

export type EventV2HeatmapsRequestParams = {
	deviceUUID?: string | null;
	eventUUID?: string | null;
	alarmCode?: string | null;
	period?: string;
	type?: string;
	month?: number;
	year?: number;
};

export interface EventV2HeatmapsResponse {
	data: EventHeatmaps[];
}

export interface EventV2HeatmapsState extends AsyncReducerState {
	data: EventHeatmaps[];
}

const initialState: EventV2HeatmapsState = {
	data: [],
	...defaultAsyncReducerState,
};

const REQUEST = HEATMAPS_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = HEATMAPS_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = HEATMAPS_MODULE + '_RESPONSE_FAILURE';
const FETCH = HEATMAPS_MODULE + '_FETCH';
const RESET = HEATMAPS_MODULE + '_RESET';

const UPDATE_REQUEST = HEATMAPS_MODULE + 'UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = HEATMAPS_MODULE + 'UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = HEATMAPS_MODULE + 'UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = HEATMAPS_MODULE + 'UPDATE_FETCH';

const eventV2HeatmapsReducer = (state = initialState, action: AnyAction): EventV2HeatmapsState => {
	switch (action.type) {
		case REQUEST:
		case UPDATE_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
		case UPDATE_RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
		case UPDATE_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return {
				...state,
				fetched: true,
				data: action.payload,
			};
		case UPDATE_FETCH:
			return {
				...state,
				fetched: true,
				data: action.payload,
			};
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	getEventV2Heatmaps: {
		request: (settings: EventV2HeatmapsRequestParams) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<EventV2HeatmapsResponse>(eventsApi.getHeatmaps(settings));
				dispatch(actions.getEventV2Heatmaps.success());
				dispatch(actions.getEventV2Heatmaps.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getEventV2Heatmaps.failure(err));
			}
		},
		fetch: (response: EventV2HeatmapsResponse): ReduxAction<EventV2HeatmapsResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
};

const selectEventV2Heatmaps = (state: EventV2HeatmapsRootState): EventV2HeatmapsState => state.data;

export const useEventV2HeatmapsState = (): EventV2HeatmapsState => {
	return useSelector<EventV2HeatmapsRootState, EventV2HeatmapsState>(selectEventV2Heatmaps) || {};
};

export default eventV2HeatmapsReducer;
export const eventV2HeatmapsActions = actions;
