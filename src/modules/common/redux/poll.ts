import { API } from "api/axios";
import pollAPI from "api/endpoints/pollAPI";
import config from "config/config";
import { useBuilding } from "modules/building/containers/BuildingContainerHooks";
import { UINotificationsActions } from "modules/common/redux/uiNotifications";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import useRouter from "use-react-router";
import { useDispatchOnce } from "../helpers/redux/useActions";
import useSelector from "../helpers/redux/useSelector";
import { usePoints } from "./points";

declare global {
  interface Window {
    __ELP__POLL__SYNC__WORKER__: NodeJS.Timeout;
  }
}

export interface PollResponse {
  ts: number;
  data: PollData;
}

export interface SetpointResponse {
  value: PointValue;
}

export interface PollData {
  pointsValues: {
    [pointId: string]: PointValue;
  };
}
export interface PollState {
  lastPollTimestamp: number;
  pollCount: number;
  data: PollData;
  error: boolean;
  enabled: boolean;
  stopped: boolean;
  setpoint: {
    fetching: boolean;
    fetched: boolean;
    error: string;
  };
}

const POLL_MODULE = "common/poll/";

const REQUEST = POLL_MODULE + "REQUEST";
const RESPONSE_SUCCESS = POLL_MODULE + "RESPONSE_SUCESS";
const RESPONSE_FAILURE = POLL_MODULE + "RESPONSE_FAILURE";
const FETCH = POLL_MODULE + "FETCH";

const REMOVE = POLL_MODULE + "REMOVE";
const RESET = POLL_MODULE + "RESET";

const SET_STOPPED = POLL_MODULE + "SET_STOPPED";

// SETPOINT
const SETPOINT_REQUEST = POLL_MODULE + "SETPOINT_REQUEST";
const SETPOINT_RESPONSE_SUCCESS = POLL_MODULE + "SETPOINT_RESPONSE_SUCESS";
const SETPOINT_RESPONSE_FAILURE = POLL_MODULE + "SETPOINT_RESPONSE_FAILURE";
const SETPOINT_FETCH = POLL_MODULE + "SETPOINT_FETCH";

const initialState: PollState = {
  lastPollTimestamp: 0,
  pollCount: 0,
  data: {
    pointsValues: {},
  },
  error: false,
  enabled: true,
  stopped: false,
  setpoint: {
    fetching: false,
    fetched: false,
    error: "",
  },
};

const pollReducer = (state = initialState, action: AnyAction): PollState => {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case REQUEST:
      return { ...state, enabled: true };
    case RESPONSE_SUCCESS:
      return { ...state, error: false };
    case RESPONSE_FAILURE:
      return { ...state, error: true };
    case FETCH:
      return {
        ...state,
        data: {
          pointsValues: {
            ...state.data.pointsValues,
            ...action.payload.data.pointsValues,
          },
        },
        pollCount: state.pollCount + 1,
        lastPollTimestamp: action.payload.ts,
      };
    case RESET: {
      return {
        ...state,
        data: {
          pointsValues: {},
        },
        pollCount: 0,
        enabled: false,
      };
    }
    case REMOVE: {
      return {
        ...state,
        data: {
          pointsValues: Object.keys(state.data.pointsValues).reduce((pvs, nextPointUUID) => {
            if (action.payload.pointsUUIDs.includes(nextPointUUID)) {
              return pvs;
            } else {
              return {
                ...pvs,
                [nextPointUUID]: state.data.pointsValues[nextPointUUID],
              };
            }
          }, {} as any),
        },
      };
    }

    case SETPOINT_REQUEST: {
      return {
        ...state,
        setpoint: {
          ...state.setpoint,
          fetching: true,
          fetched: false,
          error: "",
        },
      };
    }
    case SETPOINT_RESPONSE_SUCCESS: {
      return {
        ...state,
        setpoint: {
          ...state.setpoint,
          fetching: false,
          error: "",
        },
      };
    }

    case SETPOINT_RESPONSE_FAILURE: {
      return {
        ...state,
        setpoint: {
          ...state.setpoint,
          fetching: false,
          fetched: false,
          error: action.payload.error || "",
        },
      };
    }

    case SETPOINT_FETCH: {
      return {
        ...state,
        setpoint: {
          ...state.setpoint,
          fetched: true,
        },
        data: {
          ...state.data,
          pointsValues: {
            ...state.data.pointsValues,
            [action.payload.uuid]: {
              value: Number(action.payload.value),
              ts: action.payload.ts,
            },
          },
        },
      };
    }

    case SET_STOPPED: {
      return {
        ...state,
        stopped: Boolean(action.payload),
      };
    }
    default:
      return state;
  }
};

export default pollReducer;

// @ACTIONS
const actions = {
  setStopped: (stopped: boolean) => async (dispatch: Dispatch<any>, getState: any) => {
    if (stopped) {
      clearInterval(window.__ELP__POLL__SYNC__WORKER__);
    } else {
      const { poll } = getState();
      const pointsUUIDs = Object.keys(poll.data.pointsValues || {});
      dispatch(actions.poll.request(pointsUUIDs, true));
    }
    dispatch({
      type: SET_STOPPED,
      payload: stopped,
    });
  },
  poll: {
    request:
      (points: string[], isIntervalCall: boolean = false) =>
      async (dispatch: Dispatch<any>, getState: any) => {
        const state = getState();
        const stopped = state.poll && state.poll.stopped;
        const lastPollTimestamp = state.poll && state.poll.lastPollTimestamp && isIntervalCall ? state.poll.lastPollTimestamp : -1;

        /**
         * If the source of call isn't interval then reset previous state and clear interval.
         * It'll prevent duplicated poll, and reset previous module requests on modules switching.
         *
         */
        if (!isIntervalCall) {
          clearInterval(window.__ELP__POLL__SYNC__WORKER__);
          dispatch(actions.poll.reset());
        }

        /**
         * Handle with requests only if points list arent empty
         */
        if (points.length > 0 || !stopped) {
          try {
            dispatch({ type: REQUEST });
            const response = await API.post<PollResponse>(pollAPI.getPoll(), { points, ts: lastPollTimestamp });
            // const data: Initialize = await response.json();
            dispatch(actions.poll.success());
            dispatch(actions.poll.fetch(response.data));
          } catch (err: any) {
            dispatch(actions.poll.failure(String(err)));
            clearInterval(window.__ELP__POLL__SYNC__WORKER__);
          }
        }
      },
    reset: () => {
      clearInterval(window.__ELP__POLL__SYNC__WORKER__);
      return {
        type: RESET,
      };
    },
    fetch: (response: PollResponse) => async (dispatch: Dispatch<any>, getState: any) => {
      const { poll } = getState();

      if (poll && poll.enabled && !poll.stopped) {
        clearTimeout(window.__ELP__POLL__SYNC__WORKER__); // ?
        window.__ELP__POLL__SYNC__WORKER__ = setInterval(() => {
          const { poll } = getState();
          const pointsUUIDs = Object.keys((poll ? poll.data.pointsValues : {}) || {});
          dispatch(actions.poll.request(pointsUUIDs, true));
        }, config.MAIN_POLL_INTERVAL_MS);
      }

      dispatch({
        type: FETCH,
        payload: response,
      });
    },
    success: (): AnyAction => ({
      type: RESPONSE_SUCCESS,
    }),
    failure: (error: string): AnyAction => ({
      type: RESPONSE_FAILURE,
      error: true,
    }),
  },
  setpoint: {
    request: (uuid: string, value: number) => async (dispatch: Dispatch<any>) => {
      try {
        dispatch({ type: SETPOINT_REQUEST });
        const response = await API.put<SetpointResponse>(pollAPI.setpoint(), { uuid, value });
        dispatch(actions.setpoint.success());
        dispatch(actions.setpoint.fetch(uuid, response.data));
      } catch (error) {
        dispatch({ type: SETPOINT_RESPONSE_FAILURE, payload: { error } });
        dispatch(
          UINotificationsActions.add({
            message: "Sterownik jest offline",
            variant: "error",
          })
        );
      }
    },
    success: () => ({ type: SETPOINT_RESPONSE_SUCCESS }),
    failure: () => ({ type: SETPOINT_RESPONSE_SUCCESS, error: SETPOINT_RESPONSE_FAILURE }),
    fetch: (uuid: string, response: SetpointResponse) => {
      const { value } = response;
      return {
        type: SETPOINT_FETCH,
        payload: {
          uuid,
          value,
        },
      };
    },
  },
};

// HOOKS
const selectPoll = (state: any): PollState => state.poll;

export const usePoll = (): PollState => {
  return useSelector<any, PollState>(selectPoll, []);
};

export const useLoadedPointsValues = (pointsUUIDs: string[]): PollData => {
  const { data } = usePoll();

  return pointsUUIDs.reduce(
    (values, nextUUID) => ({
      ...values,
      [nextUUID]: data.pointsValues[nextUUID] || null,
    }),
    {} as PollData
  );
};

export const usePointsValuesPoll = (points: string[]): PollData => {
  const { pollCount, data } = usePoll();
  const shouldLoad = () => points.length > 0 && pollCount === 0;
  useDispatchOnce(actions.poll.request(points), [pollCount], shouldLoad);
  return data;
};

export const usePointValue = (pointUUID: string | null | undefined): PointValue | null => {
  const poll = usePoll();

  if (pointUUID && poll) {
    if (poll.data) {
      return poll.data.pointsValues[pointUUID] || null;
    }
  }
  return null;
};

export const usePointValueByXid = (xid: string, disableFetch?: boolean) => {
  const {
    match: {
      params: { uuid },
    },
  } = useRouter<{ uuid: string }>();
  const { building } = useBuilding(uuid, disableFetch);

  let pointUUID = "";

  if (building && building.pointsXidsRefs) {
    pointUUID = building.pointsXidsRefs[xid];
  }

  return usePointValue(pointUUID);
};

export const usePointByXid = (xid: string) => {
  const { points } = usePoints();
  const point = points.find((point) => point.xid === xid);
  return point as Point;
};

export const pollActions = actions;
