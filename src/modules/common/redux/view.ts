import { API } from 'api/axios';
import viewsAPI from 'api/endpoints/viewsAPI';
import { buildingActions } from 'modules/building/redux/building';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const REDUX_MODULE = 'common/view/';

const REQUEST = REDUX_MODULE + 'REQUEST';
const RESPONSE_SUCCESS = REDUX_MODULE + 'RESPONSE_SUCESS';
const RESPONSE_FAILURE = REDUX_MODULE + 'RESPONSE_FAILURE';
const FETCH = REDUX_MODULE + 'FETCH';

const ADD_REQUEST = REDUX_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = REDUX_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = REDUX_MODULE + 'ADD_RESPONSE_FAILURE';
const ADD_FETCH = REDUX_MODULE + 'ADD_FETCH';

const REMOVE_REQUEST = REDUX_MODULE + 'REMOVE_REQUEST';
const REMOVE_RESPONSE_SUCCESS = REDUX_MODULE + 'REMOVE_RESPONSE_SUCESS';
const REMOVE_RESPONSE_FAILURE = REDUX_MODULE + 'REMOVE_RESPONSE_FAILURE';
const REMOVE_FETCH = REDUX_MODULE + 'REMOVE_FETCH';

const UPDATE_REQUEST = REDUX_MODULE + 'UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = REDUX_MODULE + 'UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = REDUX_MODULE + 'UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = REDUX_MODULE + 'UPDATE_FETCH';

const SET_ACTIVE_UNIT_XID = REDUX_MODULE + '_SET_ACTIVE_UNIT_XID';

export interface ViewResponse {
	view: ViewType;
}

export interface ViewState extends AsyncReducerState {
	view: ViewType | null;
	activeUnitXid?: string;
}

const initialState: ViewState = {
	view: null,
	...defaultAsyncReducerState,
};

const viewReducer = (state = initialState, action: AnyAction): ViewState => {
	switch (action.type) {
		case REQUEST:
		case UPDATE_REQUEST:
		case ADD_REQUEST:
		case REMOVE_REQUEST:
			return { ...state, fetching: true };

		case RESPONSE_SUCCESS:
		case UPDATE_RESPONSE_SUCCESS:
		case ADD_RESPONSE_SUCCESS:
		case REMOVE_RESPONSE_SUCCESS:
			return { ...state, error: false, fetching: false };

		case RESPONSE_FAILURE:
		case UPDATE_RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
		case REMOVE_RESPONSE_FAILURE:
			return { ...state, error: true, fetching: false };

		case SET_ACTIVE_UNIT_XID:
			return { ...state, activeUnitXid: action.payload.activeUnitXid };

		case FETCH:
		case UPDATE_FETCH:
		case ADD_FETCH:
			return {
				...state,
				view: action.payload.view,
				fetched: true,
			};
		default:
			return state;
	}
};
export default viewReducer;

const actions = {
	setUnit: (xid?: string) => ({
		type: SET_ACTIVE_UNIT_XID,
		payload: {
			activeUnitXid: xid,
		},
	}),
	get: {
		request: (viewUUID: string, loadRelatedBuilding?: boolean) => async (dispatch: Dispatch<AnyAction>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<ViewResponse>(viewsAPI.getView(viewUUID));

				if (loadRelatedBuilding && response.data.view && response.data.view.building) {
					const buildingRef = response.data.view.building;
					if (buildingRef) {
						(dispatch as any)(buildingActions.get.request(buildingRef.uuid));
					}
				}

				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: ViewResponse): ReduxAction<ViewResponse> => ({
			type: FETCH,
			payload: response,
		}),
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
	add: {
		request: (view: ViewType, buildingUUID: string) => async (dispatch: Dispatch<AnyAction>) => {
			try {
				dispatch({ type: ADD_REQUEST });
				const response = await API.post<ViewResponse>(viewsAPI.addView(buildingUUID), { view });
				dispatch(actions.add.success());
				dispatch(actions.add.fetch(response.data));
				return Promise.resolve(response.data);
			} catch (err: any) {
				dispatch(actions.add.failure(err));
			}
		},
		fetch: (response: ViewResponse): ReduxAction<ViewResponse> => ({
			type: ADD_FETCH,
			payload: response,
		}),
		success: (): AnyAction => ({
			type: ADD_RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: ADD_RESPONSE_FAILURE,
			error: true,
		}),
	},
	update: {
		request: (viewUUID: string, view: ViewType) => async (dispatch: Dispatch<AnyAction>) => {
			try {
				dispatch({ type: UPDATE_REQUEST });
				const response = await API.put<ViewResponse>(viewsAPI.updateView(viewUUID), { view });
				dispatch(actions.update.success());
				dispatch(actions.update.fetch(response.data));
				return Promise.resolve(response.data);
			} catch (err: any) {
				dispatch(actions.update.failure(err));
				return Promise.reject(err);
			}
		},
		fetch: (response: ViewResponse): ReduxAction<ViewResponse> => ({
			type: UPDATE_FETCH,
			payload: response,
		}),
		success: (): AnyAction => ({
			type: UPDATE_RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: UPDATE_RESPONSE_FAILURE,
			error: true,
		}),
	},
	remove: {
		request: (viewUUID: string) => async (dispatch: Dispatch<AnyAction>) => {
			try {
				dispatch({ type: REMOVE_REQUEST });
				const response = await API.delete<ViewResponse>(viewsAPI.removeView(viewUUID));
				dispatch(actions.remove.success());
				dispatch(actions.remove.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.remove.failure(err));
			}
		},
		fetch: (response: ViewResponse): ReduxAction<ViewResponse> => ({
			type: REMOVE_FETCH,
			payload: response,
		}),
		success: (): AnyAction => ({
			type: REMOVE_RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: REMOVE_RESPONSE_FAILURE,
			error: true,
		}),
	},
};

export const viewActions = actions;

const selectView = (state: any): ViewState => state.view;

export const useView = (): ViewState => {
	return useSelector<any, ViewState>(selectView, []);
};
