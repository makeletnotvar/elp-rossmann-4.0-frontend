import { API } from 'api/axios';
import eventsAPI from 'api/endpoints/eventsAPI';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { pages } from '../../../config/pages';
import { Modules } from '../../../constants/modules';
import { ReduxAction } from '../helpers/redux/actions';
import { useApp } from '../selectors/app';

const REDUX_MODULE = 'common/app/';

// ACTIONS

// INITIALIZE
interface Initialize {
	time: number;
}
const REQUEST = REDUX_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = REDUX_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = REDUX_MODULE + '_RESPONSE_FAILURE';
const FETCH = REDUX_MODULE + '_FETCH';
const SET_MODULE = 'SET_MODULE';
const START_PROCESSING = 'START_PROCESSING';
const STOP_PROCESSING = 'STOP_PROCESSING';

const REQUEST_EVENTS_STATS = 'REQUEST_EVENTS_STATS';
const RECEIVE_EVENTS_STATS_SUCCESS = 'RECEIVE_EVENTS_STATS_SUCCESS';
const RECEIVE_EVENTS_STATS_FAILURE = 'RECEIVE_EVENTS_STATS_FAILURE';
const FETCH_EVENTS_STATS = 'FETCH_EVENTS_STATS';

const ENABLE_DEBUG = 'ENABLE_DEBUG';
const DISABLE_DEBUG = 'DISABLE_DEBUG';

interface EventsCountResponse {
	eventsSummary: {
		alarmsMaxPriority: number;
		alarmsCount: number;
		events: BuildingEvent[];
	};
}

// REDUCER
export interface AppState {
	currentModule: Modules;
	initialServerTime: number;
	initialClientTime: number;
	lang: string;
	processing: boolean;
	alarmsCount?: number;
	alarmsMaxPriority?: number;
	events: BuildingEvent[];
	debug?: boolean;
}

const initialState: AppState = {
	currentModule: Modules.VIEWS,
	initialServerTime: 0,
	initialClientTime: 0,
	lang: 'pl',
	processing: false,
	alarmsCount: 0,
	alarmsMaxPriority: 0,
	events: [],
	debug: false,
};

const appReducer = (state = initialState, action: AnyAction): AppState => {
	switch (action.type) {
		case FETCH: {
			const initialServerTime = (action as ReduxAction<Initialize>).payload.time;
			return { ...state, initialServerTime };
		}
		case SET_MODULE:
			return { ...state, currentModule: action.payload.currentModule };
		case START_PROCESSING:
			return { ...state, processing: true };
		case STOP_PROCESSING:
			return { ...state, processing: false };
		case FETCH_EVENTS_STATS: {
			const { alarmsCount, alarmsMaxPriority, events } = action.payload;
			return { ...state, alarmsCount, alarmsMaxPriority, events };
		}
		case ENABLE_DEBUG:
			return { ...state, debug: true };
		case DISABLE_DEBUG:
			return { ...state, debug: false };
		default:
			return state;
	}
};

export default appReducer;

const fetchx = (some: string): Promise<Initialize> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve({ time: Date.now() }), 1000);
	});
};

// @ACTIONS
export const actions = {
	request: () => async (dispatch: Dispatch<AnyAction>) => {
		try {
			dispatch({ type: REQUEST });
			const response = await fetchx('some');
			// const data: Initialize = await response.json();
			dispatch(actions.fetch(response));
		} catch (err: any) {
			dispatch(actions.responseFailure(err));
		}
	},
	fetch: (initializeResponse: Initialize): ReduxAction<Initialize> => ({
		type: FETCH,
		payload: {
			time: initializeResponse.time,
		},
	}),
	responseSuccess: (): AnyAction => ({
		type: RESPONSE_SUCCESS,
	}),
	responseFailure: (error: string): AnyAction => ({
		type: RESPONSE_FAILURE,
		error: true,
	}),
	setModule: (module: Modules) => ({
		type: SET_MODULE,
		payload: { currentModule: module },
	}),
	setDebug: (debug: boolean) => ({
		type: debug ? ENABLE_DEBUG : DISABLE_DEBUG,
	}),
	processing: (state: boolean) => ({
		type: state ? START_PROCESSING : STOP_PROCESSING,
	}),
	requestEventsCount: () => async (dispatch: Dispatch<AnyAction>, getState: any) => {
		const state = getState();
		const userLogged = state.auth.user && (state.auth.verified || state.auth.fetched);

		if (userLogged) {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<EventsCountResponse>(eventsAPI.getEventsCount());
				const { alarmsMaxPriority, alarmsCount, events } = response.data.eventsSummary;
				dispatch(actions.fetchEventsCount(alarmsCount, alarmsMaxPriority, events));
			} catch (err: any) {
				dispatch(actions.responseFailure(err));
			}
		}
	},
	fetchEventsCount: (alarmsCount: number, alarmsMaxPriority: number, events: BuildingEvent[]) => {
		return {
			type: FETCH_EVENTS_STATS,
			payload: { alarmsCount, alarmsMaxPriority, events },
		};
	},
};

// HOOKS

export const useAppModuleName = () => {
	const { currentModule } = useApp();
	const currentPageConfig = Object.values(pages).find(page => page.moduleType === currentModule);
	return currentPageConfig ? currentPageConfig.title : undefined;
};

export const useAppCurrentModule = () => {
	const { currentModule } = useApp();
	return currentModule;
};

export const appActions = actions;
