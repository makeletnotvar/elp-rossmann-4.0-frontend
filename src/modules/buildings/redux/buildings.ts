import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import { uniqueArray } from 'helpers/data';
import { BuildingsRootState } from 'modules/buildings/redux';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { pollActions } from 'modules/common/redux/poll';
import { AnyAction, Dispatch } from 'redux';

const BUILDINGS_MODULE = 'buildings/buildings';

export interface BuildingsResponse {
	buildings: Building[];
	countAll: number;
	count: number;
}

const REQUEST = BUILDINGS_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = BUILDINGS_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = BUILDINGS_MODULE + '_RESPONSE_FAILURE';
const FETCH = BUILDINGS_MODULE + '_FETCH';
const RESET = BUILDINGS_MODULE + '_RESET';

const ADD_REQUEST = BUILDINGS_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = BUILDINGS_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = BUILDINGS_MODULE + 'ADD_RESPONSE_FAILURE';

export interface BuildingsState extends AsyncReducerState {
	buildings: Building[];
	countAll: number;
	count: number;
}

const initialState: BuildingsState = {
	buildings: [],
	count: -1,
	countAll: -1,
	...defaultAsyncReducerState,
};

const buildingsReducer = (state = initialState, action: AnyAction): BuildingsState => {
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
			return { ...state, fetched: true, buildings: action.payload.buildings, countAll: action.payload.countAll, count: action.payload.count };
		case RESET:
			return initialState;

		default:
			return state;
	}
};

interface RequestSettings {
	param: string;
	dir: 'asc' | 'desc';
	offset: number;
	q: string;
	rowsPerPage: number;
	[param: string]: any;
}

const extractAsyncParamsPointsUUID = (response: BuildingsResponse, asyncParams: string[]): string[] => {
	const params = response.buildings.reduce(
		(allParams, nextBuilding) => [
			...allParams,
			...Object.keys(nextBuilding).reduce(
				(params: string[], nextParam: string) => (asyncParams.includes(nextParam) ? [...params, (nextBuilding as any)[nextParam]] : params),
				[]
			),
		],
		[] as string[]
	);

	const uniqueParams = uniqueArray<string>(params);
	return uniqueParams;
};

const actions = {
	get: {
		request: (settings: RequestSettings, asyncColumns?: string[]) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch(pollActions.poll.reset());
				dispatch({ type: REQUEST });
				const response = await API.get<BuildingsResponse>(buildingsAPI.getBuildings(settings));
				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
				if (asyncColumns && asyncColumns.length) {
					const extractedAsyncParamsPoints = extractAsyncParamsPointsUUID(response.data, asyncColumns);
					dispatch(pollActions.poll.request(extractedAsyncParamsPoints));
				}
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: BuildingsResponse): ReduxAction<BuildingsResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({ type: RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: RESPONSE_FAILURE, error: true }),
	},
};

// HOOKS
const selectBuildings = (state: BuildingsRootState): BuildingsState => state.buildings;

export const useBuildingsState = (): BuildingsState => {
	return useSelector<BuildingsRootState, BuildingsState>(selectBuildings);
};

export default buildingsReducer;

export const buildingsActions = actions;
