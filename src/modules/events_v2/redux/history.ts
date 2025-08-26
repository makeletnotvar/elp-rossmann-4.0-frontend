import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';
import { EventV2HistoryRootState } from '.';
import { ElpEventV2Stats } from '../interfaces/eventV2-stats.interface';

const HISTORY_MODULE = 'history/history';

export interface EventV2HistoryResponse {
	event: ElpEventV2Stats | null;
}

export interface EventV2HistoryState extends AsyncReducerState {
	event: ElpEventV2Stats | null;
}

const initialState: EventV2HistoryState = {
	event: null,
	...defaultAsyncReducerState,
};

const REQUEST = HISTORY_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = HISTORY_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = HISTORY_MODULE + '_RESPONSE_FAILURE';
const FETCH = HISTORY_MODULE + '_FETCH';
const RESET = HISTORY_MODULE + '_RESET';

const eventV2HistoryReducer = (state = initialState, action: AnyAction): EventV2HistoryState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return {
				...state,
				fetched: true,
				event: action.payload.event,
			};
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getEventV2History: {
		request: (options: any) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<EventV2HistoryResponse>(eventsApi.getHistory(options));
				dispatch(actions.getEventV2History.success());
				dispatch(actions.getEventV2History.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getEventV2History.failure(err));
			}
		},
		fetch: (response: EventV2HistoryResponse): ReduxAction<EventV2HistoryResponse> => {
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

const selectEventV2History = (state: EventV2HistoryRootState): EventV2HistoryState => state.eventStats;

export const useEventV2HistoryState = (): EventV2HistoryState => {
	return useSelector<EventV2HistoryRootState, EventV2HistoryState>(selectEventV2History) || {};
};

export default eventV2HistoryReducer;
export const eventV2HistoryActions = actions;
