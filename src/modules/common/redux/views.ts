import { API } from 'api/axios';
import viewsAPI from 'api/endpoints/viewsAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { getSharedViews } from '../helpers/views/getSharedViews';
import { AuthState } from './auth';

const REDUX_MODULE = 'common/views/';

const REQUEST = REDUX_MODULE + 'REQUEST';
const RESPONSE_SUCCESS = REDUX_MODULE + 'RESPONSE_SUCESS';
const RESPONSE_FAILURE = REDUX_MODULE + 'RESPONSE_FAILURE';
const FETCH = REDUX_MODULE + 'FETCH';

const REMOVE_REQUEST = REDUX_MODULE + 'REMOVE_REQUEST';
const REMOVE_RESPONSE_SUCCESS = REDUX_MODULE + 'REMOVE_RESPONSE_SUCESS';
const REMOVE_RESPONSE_FAILURE = REDUX_MODULE + 'REMOVE_RESPONSE_FAILURE';
const REMOVE_FETCH = REDUX_MODULE + 'REMOVE_FETCH';

export interface ViewsResponse {
	views: ViewType[];
}

export interface ViewsRootState extends AsyncReducerState {
	views: ViewType[];
}

const initialState: ViewsRootState = {
	views: [],
	...defaultAsyncReducerState,
};

const viewsReducer = (state = initialState, action: AnyAction): ViewsRootState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true };
		case RESPONSE_SUCCESS:
			return { ...state, error: false, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, error: true, fetching: false };
		case FETCH:
			return {
				...state,
				views: action.payload.views,
				fetched: true,
			};
		case REMOVE_FETCH: {
			return {
				...state,
				views: state.views.filter(view => view.uuid !== action.payload.viewUUID),
			};
		}
		default:
			return state;
	}
};
export default viewsReducer;

const actions = {
	get: {
		// Request with specified building UUID param are getting all views related to building
		// in other case all user views
		request: (buildingUUID: string | null) => async (dispatch: Dispatch<AnyAction>, getState: any) => {
			try {
				const authState: AuthState = getState()['auth'] || {};
				dispatch({ type: REQUEST });
				const response = buildingUUID
					? await API.get<ViewsResponse>(viewsAPI.getBuildingViews(buildingUUID))
					: await API.get<ViewsResponse>(viewsAPI.getViews());
				const filteredViews = (response.data?.views || []).filter(view => getSharedViews(view, authState.user));
				dispatch(actions.get.success());
				dispatch(actions.get.fetch({ views: filteredViews }));
				return Promise.resolve({ views: filteredViews });
			} catch (err: any) {
				dispatch(actions.get.failure(String(err)));
				return Promise.reject();
			}
		},
		fetch: (response: ViewsResponse): ReduxAction<ViewsResponse> => ({
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
	remove: {
		request: (viewUUID: string) => async (dispatch: Dispatch<AnyAction>) => {
			try {
				dispatch({ type: REMOVE_REQUEST });
				await API.delete(viewsAPI.removeView(viewUUID));
				dispatch(actions.remove.success());
				dispatch(actions.remove.fetch(viewUUID));
			} catch (err: any) {
				dispatch(actions.remove.failure(String(err)));
			}
		},
		fetch: (viewUUID: string): ReduxAction<{}> => ({
			type: REMOVE_FETCH,
			payload: { viewUUID },
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

const selectViews = (state: any): ViewsRootState => state.views;

export const useViews = (): ViewsRootState => {
	return useSelector<any, ViewsRootState>(selectViews, []);
};

// @UNUSED @TODO
// export const useViewsList = (force: boolean = false): ViewType[] => {
//     const viewsState = useViews();
//     const { views, fetched } = viewsState;
//     const shouldLoad = () => !fetched || force;
//     useDispatchOnce(actions.get.request(null), [], shouldLoad);
//     return views;
// };

export const viewsActions = actions;
