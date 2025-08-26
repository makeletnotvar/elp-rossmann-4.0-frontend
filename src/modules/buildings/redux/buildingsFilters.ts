import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import { BuildingsRootState } from 'modules/buildings/redux';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { pollActions } from 'modules/common/redux/poll';
import { AnyAction, Dispatch } from 'redux';

const BUILDINGS_MODULE = 'buildings/buildings-filters';

export interface BuildingsFiltersResponse {
	buildingsFilters: BuildingsFiltersPoints[];
}

const REQUEST = BUILDINGS_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = BUILDINGS_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = BUILDINGS_MODULE + '_RESPONSE_FAILURE';
const FETCH = BUILDINGS_MODULE + '_FETCH';
const RESET = BUILDINGS_MODULE + '_RESET';

const ADD_REQUEST = BUILDINGS_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = BUILDINGS_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = BUILDINGS_MODULE + 'ADD_RESPONSE_FAILURE';

export interface BuildingsFiltersState extends AsyncReducerState {
	buildingsFilters: BuildingsFiltersPoints[];
}

const initialState: BuildingsFiltersState = {
	buildingsFilters: [],
	...defaultAsyncReducerState,
};

const buildingsFiltersReducer = (state = initialState, action: AnyAction): BuildingsFiltersState => {
	switch (action.type) {
		case REQUEST:
		case ADD_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
		case ADD_RESPONSE_SUCCESS:
			return { ...state, fetching: false };

		case RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };

		case FETCH:
			return { ...state, fetched: true, buildingsFilters: action.payload };
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	get: {
		request: () => async (dispatch: Dispatch<any>) => {
			try {
				dispatch(pollActions.poll.reset());
				dispatch({ type: REQUEST });
				const response = await API.get<BuildingsFiltersResponse>(buildingsAPI.getBuildingsFiltersPoints());
				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: BuildingsFiltersResponse): ReduxAction<BuildingsFiltersResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
};

const selectBuildingsFilters = (state: BuildingsRootState): BuildingsFiltersState => state.buildingsFilters;

export const useBuildingsFiltersState = (): BuildingsFiltersState => {
	return useSelector<BuildingsRootState, BuildingsFiltersState>(selectBuildingsFilters);
};

export default buildingsFiltersReducer;

export const buildingsFiltersActions = actions;
