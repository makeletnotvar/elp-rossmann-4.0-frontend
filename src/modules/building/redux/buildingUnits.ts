import { API } from 'api/axios';
import { buildingUnitsAPI } from 'api/endpoints/buildingUnitsAPI';
import { BuildingRootState } from 'modules/building/redux';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';

const BUILDING_UNITS_MODULE = 'building/units';

export interface BuildingUnitsResponse {
	units: Unit[];
}
export interface BuildingUnitResponse {
	unit: Unit;
}

export interface BuildingUnitsState extends AsyncReducerState {
	units: Unit[];
}

const initialState: BuildingUnitsState = {
	units: [],
	...defaultAsyncReducerState,
};

const REQUEST = BUILDING_UNITS_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = BUILDING_UNITS_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = BUILDING_UNITS_MODULE + '_RESPONSE_FAILURE';
const FETCH = BUILDING_UNITS_MODULE + '_FETCH';
const RESET = BUILDING_UNITS_MODULE + '_RESET';

const ADD_REQUEST = BUILDING_UNITS_MODULE + '_ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = BUILDING_UNITS_MODULE + '_ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = BUILDING_UNITS_MODULE + '_ADD_RESPONSE_FAILURE';
const ADD_FETCH = BUILDING_UNITS_MODULE + '_ADD_FETCH';
const ADD_RESET = BUILDING_UNITS_MODULE + '_ADD_RESET';

const UPDATE_REQUEST = BUILDING_UNITS_MODULE + '_UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = BUILDING_UNITS_MODULE + '_UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = BUILDING_UNITS_MODULE + '_UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = BUILDING_UNITS_MODULE + '_UPDATE_FETCH';

const REMOVE_REQUEST = BUILDING_UNITS_MODULE + '_REMOVE_REQUEST';
const REMOVE_RESPONSE_SUCCESS = BUILDING_UNITS_MODULE + '_REMOVE_RESPONSE_SUCESS';
const REMOVE_RESPONSE_FAILURE = BUILDING_UNITS_MODULE + '_REMOVE_RESPONSE_FAILURE';
const REMOVE_FETCH = BUILDING_UNITS_MODULE + '_REMOVE_FETCH';

const buildingUnitsReducer = (state = initialState, action: AnyAction): BuildingUnitsState => {
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
			return { ...state, fetched: true, units: action.payload.units };
		case UPDATE_FETCH:
			return { ...state, fetched: true, units: state.units.map(unit => (unit.xid === action.payload.unit.xid ? action.payload.unit : unit)) };
		case ADD_FETCH:
			return { ...state, fetched: true, units: [...state.units, action.payload.unit] };
		case REMOVE_FETCH:
			return { ...state, fetched: true, units: state.units.filter(unit => unit.xid !== action.payload.xid) };
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
				const response = await API.get<BuildingUnitsResponse>(buildingUnitsAPI.getBuildingUnits(uuid));

				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: BuildingUnitsResponse): ReduxAction<BuildingUnitsResponse> => {
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
	update: {
		request: (buildingUUID: string, unitXid: string, unit: Unit) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: UPDATE_REQUEST });
			try {
				const response = await API.put<BuildingUnitResponse>(buildingUnitsAPI.updateBuildingUnit(buildingUUID, unitXid), { unit });
				dispatch(actions.update.success());
				dispatch(actions.update.fetch(response.data));
				return Promise.resolve(response.data.unit);
			} catch (err: any) {
				dispatch(actions.update.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: BuildingUnitResponse): ReduxAction<BuildingUnitResponse> => ({
			type: UPDATE_FETCH,
			payload: response,
		}),
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({
			type: UPDATE_RESPONSE_FAILURE,
			error: true,
		}),
	},
	add: {
		request: (buildingUUID: string, unit: Partial<Unit>, callback: () => void) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: ADD_REQUEST });
			try {
				const response = await API.post<BuildingUnitResponse>(buildingUnitsAPI.addBuildingUnit(buildingUUID), { unit });
				dispatch(actions.add.success());
				dispatch(actions.add.fetch(response.data));
				callback && callback();
				return Promise.resolve(response.data.unit);
			} catch (err: any) {
				dispatch(actions.add.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: BuildingUnitResponse): ReduxAction<BuildingUnitResponse> => ({
			type: ADD_FETCH,
			payload: response,
		}),
		success: (): AnyAction => ({ type: ADD_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({
			type: ADD_RESPONSE_FAILURE,
			error: true,
		}),
	},
	remove: {
		request: (uuid: string, xid: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: REMOVE_REQUEST });

			try {
				await API.delete<BuildingUnitResponse>(buildingUnitsAPI.removeBuildingUnit(uuid, xid));
				dispatch(actions.remove.success());
				dispatch(actions.remove.fetch(xid));
				return Promise.resolve();
			} catch (err: any) {
				dispatch(actions.remove.failure(err));
				return Promise.reject();
			}
		},
		fetch: (xid: string): AnyAction => ({ type: REMOVE_FETCH, payload: { xid } }),
		success: (): AnyAction => ({ type: REMOVE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({
			type: REMOVE_RESPONSE_FAILURE,
			error: true,
		}),
	},
};

const selectBuildingUnits = (state: BuildingRootState): BuildingUnitsState => state.buildingUnits;

export const useBuildingUnitsState = (): BuildingUnitsState => {
	return useSelector<BuildingRootState, BuildingUnitsState>(selectBuildingUnits) || {};
};

export default buildingUnitsReducer;
export const buildingUnitsActions = actions;
