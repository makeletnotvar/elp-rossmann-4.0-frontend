import { API } from "api/axios";
import { devicesAPI } from "api/endpoints/devicesAPI";
import { arrayDiff, mergeWithoutDuplicates } from "helpers/data";
import { removeArrayItem, updateArrayItem } from "helpers/state";
import { pollActions } from "modules/common/redux/poll";
import { ViewsRootState } from "modules/common/redux/views";
import { useEffect } from "react";
import { AnyAction, Dispatch } from "redux";
import { ReduxAction } from "../helpers/redux/actions";
import { AsyncReducerState, defaultAsyncReducerState } from "../helpers/redux/reducers";
import { useDispatch, useDispatchOnce } from "../helpers/redux/useActions";
import useSelector from "../helpers/redux/useSelector";

export interface PointsResponse {
  points: Point[];
}

export interface PointsState extends AsyncReducerState {
  points: Point[];
}

const POINTS_MODULE = "common/points/";

// REQUEST
const REQUEST = POINTS_MODULE + "REQUEST";
const RESPONSE_SUCCESS = POINTS_MODULE + "RESPONSE_SUCESS";
const RESPONSE_FAILURE = POINTS_MODULE + "RESPONSE_FAILURE";
const FETCH = POINTS_MODULE + "FETCH";
const ADD = POINTS_MODULE + "ADD";
const UPDATE = POINTS_MODULE + "UPDATE";
const REMOVE = POINTS_MODULE + "REMOVE";

const initialState: PointsState = {
  points: [],
  ...defaultAsyncReducerState,
};

export const pointsReducer = (state = initialState, action: AnyAction): PointsState => {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case REQUEST:
      return { ...state, fetching: true };
    case RESPONSE_SUCCESS:
      return { ...state, error: false, fetching: false };
    case RESPONSE_FAILURE:
      return { ...state, error: true, fetching: false };
    case FETCH:
      const points = action.payload.merge ? mergeWithoutDuplicates(state.points, action.payload.points, "uuid") : action.payload.points;

      return {
        ...state,
        points,
        fetched: true,
      };

    case ADD:
      return {
        ...state,
        points: [...state.points, ...action.payload.points],
        fetched: true,
      };

    case UPDATE: {
      return {
        ...state,
        points: updateArrayItem(state.points, "uuid", action.payload.point.uuid, action.payload.point),
      };
    }

    case REMOVE: {
      return {
        ...state,
        points: removeArrayItem(state.points, "uuid", action.payload.uuid),
      };
    }

    default:
      return state;
  }
};

export default pointsReducer;

// Actions
export const actions = {
  get: {
    request: (pointsUUIDs: string[], merge?: boolean) => async (dispatch: Dispatch<AnyAction>) => {
      if (pointsUUIDs.length > 0) {
        try {
          dispatch({ type: REQUEST });
          const response = await API.post<PointsResponse>(devicesAPI.getPoints(), { points: pointsUUIDs });
          dispatch(actions.get.success());
          dispatch(actions.get.fetch(response.data, merge));
        } catch (err: any) {
          dispatch(actions.get.failure(err));
        }
      }
    },
    fetch: (response: PointsResponse, merge?: boolean): ReduxAction<PointsResponse & { merge?: boolean }> => ({
      type: FETCH,
      payload: { ...response, merge },
    }),
    success: (): AnyAction => ({
      type: RESPONSE_SUCCESS,
    }),
    failure: (error: string): AnyAction => ({
      type: RESPONSE_FAILURE,
      error: true,
    }),
  },
  add: (points: Point[]) => ({
    type: ADD,
    payload: { points },
    fetched: true,
  }),
  update: (point: Point) => ({
    type: UPDATE,
    payload: { point },
  }),
  remove: (uuid: string) => ({
    type: REMOVE,
    payload: { uuid },
  }),
};

// HOOKS
const selectPoints = (state: any): PointsState => state.points;

export const usePoints = (): PointsState => {
  return useSelector<ViewsRootState, PointsState>(selectPoints, []) || {};
};

export const useFilteredPoints = (pointsUUIDs: string[]): { [uuid: string]: Point | null } => {
  const { points = [] } = usePoints();

  return pointsUUIDs.reduce((labels, nextUUID) => {
    const nextPoint = points.find((p) => p.uuid === nextUUID) || null;
    return { ...labels, [nextUUID]: nextPoint };
  }, {} as { [uuid: string]: Point | null });
};

export const usePointsList = (pointsUUIDS: string[]) => {
  const { fetched, fetching, points } = usePoints();
  const shouldLoad = () => !fetched;
  useDispatchOnce(actions.get.request(pointsUUIDS), [], shouldLoad);
  return { points, fetched, fetching };
};

export const usePoint = (uuid: string | undefined | null, xid: string | undefined | null = null): Point | null => {
  const { points = [], fetched = false } = usePoints();

  const uuidFilter = (point: Point) => point.uuid === uuid;
  const xidFilter = (point: Point) => point.xid === xid;

  const point = points && fetched ? points.find(uuid ? uuidFilter : xidFilter) || null : null;

  return point;
};

export const usePointsWithLoad = (nextPointsUUIDs: string[], initPoll: boolean = false, merge = true) => {
  const { fetched, fetching, points, error } = usePoints();
  const currentPointsUUIDs = points.map((p) => p.uuid || "");
  const notExistingPointsUUIDs: string[] = arrayDiff(currentPointsUUIDs, nextPointsUUIDs);
  const dispatch = useDispatch();

  useEffect(() => {
    if (notExistingPointsUUIDs.length > 0) {
      dispatch(actions.get.request(notExistingPointsUUIDs, merge));

      if (initPoll) {
        dispatch(pollActions.poll.request(notExistingPointsUUIDs));
      }
    }
  }, [JSON.stringify(notExistingPointsUUIDs)]);

  return { points, fetching, fetched, error };
};

export const pointsActions = actions;
