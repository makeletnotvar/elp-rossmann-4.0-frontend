import { API } from 'api/axios';
import { devicesAPI } from 'api/endpoints/devicesAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { pointsActions } from 'modules/common/redux/points';
import { deviceActions } from 'modules/device/redux/device';
import { AnyAction, Dispatch } from 'redux';

const DEVICE_MODULE = 'device/points';

export interface DevicePointResponse {
	point: Point;
}

export interface DevicePointsResponse {
	points: Point[];
}

export interface DevicePointsState extends AsyncReducerState {
	//
}

const initialState: DevicePointsState = {
	...defaultAsyncReducerState,
};

const ADD_REQUEST = DEVICE_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = DEVICE_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = DEVICE_MODULE + 'ADD_RESPONSE_FAILURE';
const ADD_FETCH = DEVICE_MODULE + 'ADD_FETCH';

const UPDATE_REQUEST = DEVICE_MODULE + 'UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = DEVICE_MODULE + 'UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = DEVICE_MODULE + 'UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = DEVICE_MODULE + 'UPDATE_FETCH';

const REMOVE_REQUEST = DEVICE_MODULE + 'REMOVE_REQUEST';
const REMOVE_RESPONSE_SUCCESS = DEVICE_MODULE + 'REMOVE_RESPONSE_SUCESS';
const REMOVE_RESPONSE_FAILURE = DEVICE_MODULE + 'REMOVE_RESPONSE_FAILURE';
const REMOVE_FETCH = DEVICE_MODULE + 'REMOVE_FETCH';

const RESET = DEVICE_MODULE + 'REMOVE_FETCH';

const devicePointsReducer = (state = initialState, action: AnyAction): DevicePointsState => {
	switch (action.type) {
		case ADD_REQUEST:
		case UPDATE_REQUEST:
		case REMOVE_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case ADD_RESPONSE_SUCCESS:
		case UPDATE_RESPONSE_SUCCESS:
		case REMOVE_RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case UPDATE_RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
		case REMOVE_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case REMOVE_FETCH:
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	add: {
		request: (uuid: string, pointsRefs: PointRegisterReference[]) => async (dispatch: Dispatch<any>) => {
			try {
				if (!!uuid) {
					dispatch({ type: ADD_REQUEST });
					const response = await API.post<{ device: Device }>(devicesAPI.addDevicePoints(uuid), { pointsRefs });
					dispatch(actions.add.success());
					dispatch(actions.add.fetch(response.data.device));
				}
			} catch (err: any) {
				dispatch(actions.add.failure(err));
			}
		},
		fetch: (device: DetailedDevice) => async (dispatch: Dispatch<any>) => {
			if (device) {
				dispatch(deviceActions.fetch(device));
				dispatch(pointsActions.get.request(device.points ? device.points.map(point => point.uuid) : []));
			}
		},
		success: (): AnyAction => ({
			type: ADD_RESPONSE_SUCCESS,
		}),
		failure: (error: string): AnyAction => ({
			type: ADD_RESPONSE_FAILURE,
			error: true,
		}),
	},
	update: {
		request: (uuid: string, point: Point) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: UPDATE_REQUEST });
			try {
				const response = await API.put<DevicePointResponse>(devicesAPI.updatePoint(uuid), { point });
				dispatch(actions.update.success());
				dispatch(actions.update.fetch(response.data));
				return Promise.resolve(response.data.point);
			} catch (err: any) {
				dispatch(actions.update.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: DevicePointResponse): ReduxAction<DevicePointResponse> => {
			return pointsActions.update(response.point);
		},
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: UPDATE_RESPONSE_FAILURE, error: true }),
	},
	remove: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: REMOVE_REQUEST });
			try {
				const response = await API.delete<DevicePointResponse>(devicesAPI.removePoint(uuid));
				dispatch(actions.remove.success());
				dispatch(actions.remove.fetch(uuid));
				return Promise.resolve(response.data.point);
			} catch (err: any) {
				dispatch(actions.remove.failure(err));
				return Promise.reject();
			}
		},
		fetch: (uuid: string): ReduxAction<any> => {
			return pointsActions.remove(uuid);
		},
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: UPDATE_RESPONSE_FAILURE, error: true }),
	},
};

export default devicePointsReducer;
export const devicePointsActions = actions;
