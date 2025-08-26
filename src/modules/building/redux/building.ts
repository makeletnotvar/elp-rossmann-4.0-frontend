import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import { BuildingRootState } from 'modules/building/redux';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';
import { PointsResponse, pointsActions } from '../../common/redux/points';
import { pollActions } from '../../common/redux/poll';

const BUILDING_MODULE = 'building/building';

export interface BuildingResponse {
	building: Building;
}

export interface BuildingState extends AsyncReducerState {
	building: Building | null;
}

const initialState: BuildingState = {
	building: null,
	...defaultAsyncReducerState,
};

const REQUEST = BUILDING_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = BUILDING_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = BUILDING_MODULE + '_RESPONSE_FAILURE';
const FETCH = BUILDING_MODULE + '_FETCH';
const RESET = BUILDING_MODULE + '_RESET';

/* Request building related points */
const POINTS_REQUEST = BUILDING_MODULE + 'POINTS_REQUEST';
const POINTS_RESPONSE_SUCCESS = BUILDING_MODULE + 'POINTS_RESPONSE_SUCESS';
const POINTS_RESPONSE_FAILURE = BUILDING_MODULE + 'POINTS_RESPONSE_FAILURE';
const POINTS_FETCH = BUILDING_MODULE + 'POINTS_FETCH';

const ADD_REQUEST = BUILDING_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = BUILDING_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = BUILDING_MODULE + 'ADD_RESPONSE_FAILURE';
const ADD_FETCH = BUILDING_MODULE + 'ADD_FETCH';

const UPDATE_REQUEST = BUILDING_MODULE + 'UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = BUILDING_MODULE + 'UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = BUILDING_MODULE + 'UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = BUILDING_MODULE + 'UPDATE_FETCH';

const REMOVE_REQUEST = BUILDING_MODULE + 'REMOVE_REQUEST';
const REMOVE_RESPONSE_SUCCESS = BUILDING_MODULE + 'REMOVE_RESPONSE_SUCESS';
const REMOVE_RESPONSE_FAILURE = BUILDING_MODULE + 'REMOVE_RESPONSE_FAILURE';
const REMOVE_FETCH = BUILDING_MODULE + 'REMOVE_FETCH';

const buildingReducer = (state = initialState, action: AnyAction): BuildingState => {
	switch (action.type) {
		case REQUEST:
		case UPDATE_REQUEST:
		case ADD_REQUEST:
		case REMOVE_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
		case UPDATE_RESPONSE_SUCCESS:
		case ADD_RESPONSE_SUCCESS:
		case REMOVE_RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
		case UPDATE_RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
		case REMOVE_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
		case UPDATE_FETCH:
		case ADD_FETCH:
			return { ...state, fetched: true, building: action.payload.building };
		case REMOVE_FETCH:
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	get: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<BuildingResponse>(buildingsAPI.getBuilding(uuid));
				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: BuildingResponse): ReduxAction<BuildingResponse> => {
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
	getPoints: {
		/**
		 * Request building points, and
		 *
		 *
		 */
		request:
			(uuid: string, additionalAsyncPointsUUIDs: string[] = []) =>
			async (dispatch: Dispatch<any>) => {
				dispatch({ type: POINTS_REQUEST });

				try {
					const response = await API.get<PointsResponse>(buildingsAPI.getBuildingPoints(uuid));
					dispatch(actions.getPoints.success());
					dispatch(actions.getPoints.fetch(response.data));

					// Fetch in points reducer and request for polling
					dispatch(pointsActions.get.fetch(response.data));
					const points: Point[] = response.data.points;
					const pointsUUIDs: string[] = points ? points.map(p => p.uuid!) : [];
					if (pointsUUIDs && pointsUUIDs.length) {
						dispatch(pollActions.poll.request([...pointsUUIDs, ...additionalAsyncPointsUUIDs]));
					}
				} catch (err: any) {
					dispatch(actions.getPoints.failure(err));
				}
			},
		success: () => ({ type: POINTS_RESPONSE_SUCCESS }),
		failure: (error: string) => ({ type: POINTS_RESPONSE_FAILURE, error: error }),
		fetch: (response: PointsResponse) => ({ type: POINTS_FETCH, payload: { points: response.points } }),
	},
	update: {
		request: (building: Building) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: UPDATE_REQUEST });

			try {
				const response = await API.put<BuildingResponse>(buildingsAPI.updateBuilding(building.uuid), { building });
				dispatch(actions.update.success());
				dispatch(actions.update.fetch(response.data));
				return Promise.resolve(response.data.building);
			} catch (err: any) {
				dispatch(actions.update.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: BuildingResponse): ReduxAction<BuildingResponse> => ({ type: UPDATE_FETCH, payload: response }),
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: UPDATE_RESPONSE_FAILURE, error: true }),
	},
	add: {
		request: (building: Building) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: ADD_REQUEST });

			try {
				const response = await API.post<BuildingResponse>(buildingsAPI.addBuilding(), { building });
				dispatch(actions.add.success());
				dispatch(actions.add.fetch(response.data));
				return Promise.resolve(response.data.building);
			} catch (err: any) {
				dispatch(actions.add.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: BuildingResponse): ReduxAction<BuildingResponse> => ({ type: ADD_FETCH, payload: response }),
		success: (): AnyAction => ({ type: ADD_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: ADD_RESPONSE_FAILURE, error: true }),
	},
	remove: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: REMOVE_REQUEST });

			try {
				const response = await API.delete<BuildingResponse>(buildingsAPI.removeBuilding(uuid));
				dispatch(actions.remove.success());
				dispatch(actions.remove.fetch());
				return Promise.resolve();
			} catch (err: any) {
				dispatch(actions.remove.failure(err));
				return Promise.reject();
			}
		},
		fetch: (): AnyAction => ({ type: REMOVE_FETCH }),
		success: (): AnyAction => ({ type: REMOVE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: REMOVE_RESPONSE_FAILURE, error: true }),
	},
};

const selectBuilding = (state: BuildingRootState): BuildingState => state.building;

export const useBuildingState = (): BuildingState => {
	return useSelector<BuildingRootState, BuildingState>(selectBuilding) || {};
};

export default buildingReducer;
export const buildingActions = actions;
