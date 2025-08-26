import { API } from 'api/axios';
import alarmsConfigAPI from 'api/endpoints/alarmsConfigAPI';
import { AlarmsConfigRootState } from 'modules/alarmsConfig/redux';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { AnyAction, Dispatch } from 'redux';

const ALARMS_CONFIG_MODULE = 'alarmsConfig/alarmsConfig';

export interface AlarmsConfigResponse {
	alarmsConfig: AlarmConfig[];
	count: number;
	countAll: number;
}

export interface AlarmConfigResponse {
	alarmConfig: AlarmConfig;
}

export interface AlarmsConfigState extends AsyncReducerState {
	alarmsConfig: AlarmConfig[];
	count: number;
	countAll: number;
}

const initialState: AlarmsConfigState = {
	alarmsConfig: [],
	count: 0,
	countAll: 0,
	...defaultAsyncReducerState,
};

const REQUEST = ALARMS_CONFIG_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = ALARMS_CONFIG_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = ALARMS_CONFIG_MODULE + '_RESPONSE_FAILURE';
const FETCH = ALARMS_CONFIG_MODULE + '_FETCH';
const RESET = ALARMS_CONFIG_MODULE + '_RESET';

const ADD_REQUEST = ALARMS_CONFIG_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = ALARMS_CONFIG_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = ALARMS_CONFIG_MODULE + 'ADD_RESPONSE_FAILURE';
const ADD_FETCH = ALARMS_CONFIG_MODULE + 'ADD_FETCH';

const UPDATE_REQUEST = ALARMS_CONFIG_MODULE + 'UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = ALARMS_CONFIG_MODULE + 'UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = ALARMS_CONFIG_MODULE + 'UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = ALARMS_CONFIG_MODULE + 'UPDATE_FETCH';

const DELETE_REQUEST = ALARMS_CONFIG_MODULE + 'DELETE_REQUEST';
const DELETE_RESPONSE_SUCCESS = ALARMS_CONFIG_MODULE + 'DELETE_RESPONSE_SUCESS';
const DELETE_RESPONSE_FAILURE = ALARMS_CONFIG_MODULE + 'DELETE_RESPONSE_FAILURE';
const DELETE_FETCH = ALARMS_CONFIG_MODULE + 'DELETE_FETCH';

const alarmsConfigReducer = (state = initialState, action: AnyAction): AlarmsConfigState => {
	switch (action.type) {
		case REQUEST:
		case UPDATE_REQUEST:
		case ADD_REQUEST:
		case DELETE_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
		case UPDATE_RESPONSE_SUCCESS:
		case ADD_RESPONSE_SUCCESS:
		case DELETE_RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
		case UPDATE_RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
		case DELETE_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return {
				...state,
				fetched: true,
				alarmsConfig: action.payload.alarmsConfig,
				countAll: action.payload.countAll,
				count: action.payload.count,
			};
		case UPDATE_FETCH:
			return {
				...state,
				fetched: true,
				alarmsConfig: state.alarmsConfig.map(alarmConfig => (alarmConfig.code === action.payload.alarmConfig.code ? action.payload.alarmConfig : alarmConfig)),
			};
		case ADD_FETCH:
			return {
				...state,
				fetched: true,
				alarmsConfig: [...state.alarmsConfig, action.payload.alarmConfig],
				countAll: state.countAll + 1,
				count: state.count + 1,
			};
		case DELETE_FETCH:
			return {
				...state,
				fetched: true,
				alarmsConfig: state.alarmsConfig.filter(alarmConfig => alarmConfig.code !== action.payload.code),
				countAll: state.countAll - 1,
				count: state.count - 1,
			};
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	getMany: {
		request: () => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<AlarmsConfigResponse>(alarmsConfigAPI.getMany());
				dispatch(actions.getMany.success());
				dispatch(actions.getMany.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getMany.failure(err));
			}
		},
		fetch: (response: AlarmsConfigResponse): ReduxAction<AlarmsConfigResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (err: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
	getSingle: {
		request: (code: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<AlarmConfigResponse>(alarmsConfigAPI.getSingle(code));
				dispatch(actions.getSingle.success());
				dispatch(actions.getSingle.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getSingle.failure(err));
			}
		},
		fetch: (response: AlarmConfigResponse): ReduxAction<AlarmConfigResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (err: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
	update: {
		request: (alarmConfig: AlarmConfig, code: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: UPDATE_REQUEST });

			try {
				const response = await API.put<AlarmConfigResponse>(alarmsConfigAPI.update(code), { alarmConfig });
				dispatch(actions.update.success());
				dispatch(actions.update.fetch(response.data));
				return Promise.resolve(response.data.alarmConfig);
			} catch (err: any) {
				dispatch(actions.update.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: AlarmConfigResponse): ReduxAction<AlarmConfigResponse> => ({ type: UPDATE_FETCH, payload: response }),
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: UPDATE_RESPONSE_FAILURE, error: true }),
	},
	add: {
		request: (alarmConfig: AlarmConfig) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: ADD_REQUEST });

			try {
				const response = await API.post<AlarmConfigResponse>(alarmsConfigAPI.add(), { alarmConfig });
				dispatch(actions.add.success());
				dispatch(UINotificationsActions.add({ message: 'Konfiguracja dla podanego alarmu została dodana', variant: 'success' }));
				dispatch(actions.add.fetch(response.data));
				return Promise.resolve(response.data.alarmConfig);
			} catch (err: any) {
				if (err.response.status === 409) {
					dispatch(UINotificationsActions.add({ message: 'Konfiguracja dla podanego alarmu istnieje', variant: 'error' }));
					dispatch(actions.add.failure(err));
					return Promise.resolve({ status: err.response.status, message: 'Konfiguracja dla podanego alarmu istnieje' });
				} else {
					dispatch(UINotificationsActions.add({ message: 'Błąd przy dodawaniu konfiguracji alarmu', variant: 'error' }));
					dispatch(actions.add.failure(err));
					return Promise.resolve({ status: err.response.status, message: 'Błąd przy dodawaniu konfiguracji alarmu' });
				}
			}
		},
		fetch: (response: AlarmConfigResponse): ReduxAction<AlarmConfigResponse> => ({ type: ADD_FETCH, payload: response }),
		success: (): AnyAction => ({ type: ADD_RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: ADD_RESPONSE_FAILURE, error: true }),
	},
	delete: {
		request: (code: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: DELETE_REQUEST });

			try {
				await API.delete<{ code: string }>(alarmsConfigAPI.delete(code));
				dispatch(actions.delete.success());
				dispatch(UINotificationsActions.add({ message: 'Usunięto konfiguracje alarmu', variant: 'success' }));
				dispatch(actions.delete.fetch({ code }));
				return Promise.resolve();
			} catch (err: any) {
				dispatch(UINotificationsActions.add({ message: 'Błąd przy usuwaniu konfiguracji alarmu', variant: 'error' }));
				dispatch(actions.delete.failure(err));
				return Promise.reject();
			}
		},
		fetch: (code: { code: string }): AnyAction => ({ type: DELETE_FETCH, payload: code }),
		success: (): AnyAction => ({ type: DELETE_RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: DELETE_RESPONSE_FAILURE, error: true }),
	},
};

const selectAlarmsConfig = (state: AlarmsConfigRootState): AlarmsConfigState => state.alarmsConfig;

export const useAlarmsConfigState = (): AlarmsConfigState => {
	return useSelector<AlarmsConfigRootState, AlarmsConfigState>(selectAlarmsConfig) || {};
};

export default alarmsConfigReducer;
export const alarmsConfigActions = actions;
