import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';
import { EventV2InstanceRootState } from '.';
import { ElpEventV2Instance } from '../interfaces/eventV2-instance.interface';

const INSTANCE_MODULE = 'instance/instance';

export interface EventV2InstanceResponse {
	event: ElpEventV2Instance | null;
}

export interface EventV2InstanceState extends AsyncReducerState {
	event: ElpEventV2Instance | null;
}

const initialState: EventV2InstanceState = {
	event: null,
	...defaultAsyncReducerState,
};

const REQUEST = INSTANCE_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = INSTANCE_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = INSTANCE_MODULE + '_RESPONSE_FAILURE';
const FETCH = INSTANCE_MODULE + '_FETCH';
const RESET = INSTANCE_MODULE + '_RESET';

const eventV2InstanceReducer = (state = initialState, action: AnyAction): EventV2InstanceState => {
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
	getEventInstance: {
		request: (eventUUID: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<EventV2InstanceResponse>(eventsApi.getInstance(eventUUID));
				dispatch(actions.getEventInstance.success());
				dispatch(actions.getEventInstance.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getEventInstance.failure(err));
			}
		},
		fetch: (response: EventV2InstanceResponse): ReduxAction<EventV2InstanceResponse> => {
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

const selectEventV2Instance = (state: EventV2InstanceRootState): EventV2InstanceState => state.eventInstance;

export const useEventV2InstanceState = (): EventV2InstanceState => {
	return useSelector<EventV2InstanceRootState, EventV2InstanceState>(selectEventV2Instance) || {};
};

export default eventV2InstanceReducer;
export const eventV2InstanceActions = actions;
