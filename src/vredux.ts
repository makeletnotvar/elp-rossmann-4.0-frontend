import { AnyAction, Dispatch } from 'redux';
const isAsyncFunction = require('is-async-function');

/**
 *
 *          STATUS
 *
 */

export type StatusType = 'NONE' | 'FETCHING' | 'FETCHED' | 'ERROR';

export const STATUSES: { [key in StatusType]: StatusType } = {
	NONE: 'NONE',
	FETCHING: 'FETCHING',
	FETCHED: 'FETCHED',
	ERROR: 'ERROR',
};

export const DEFAULT_STATUS = STATUSES.NONE;

/**
 *
 *          ACTIONS
 *
 */

export type ActionType = 'REQUEST' | 'SUCCESS' | 'FAILURE' | 'FETCH';

export const ACTIONS: { [key in ActionType]: ActionType } = {
	REQUEST: 'REQUEST',
	SUCCESS: 'SUCCESS',
	FAILURE: 'FAILURE',
	FETCH: 'FETCH',
};

export interface Action<T = any> {
	module: string; // actions source module
	type: string; // action function name, duplicated for be recognized in redux logger (it uses type property)
	fnName: string; // equals to type
	suffix?: ActionType; // status of async action
	async?: boolean; // type of action: sync/async
	payload: Partial<T>; // action payload
}

export type SyncAction<T> = (state: T, payload?: any) => T;
export type AsyncAction<T> = (state: T, payload?: any) => Promise<T>;
export type AsyncDispatch = (dispatch: Dispatch<Action>, getState: () => any) => Promise<any>;

export type VReduxActions<T> = {
	[key: string]: (payload?: any) => Action<T> | AsyncDispatch;
};

/**
 *
 *          HELPERS
 *
 */

export interface ExtendedState<T = any> {
	data: T;
	status: StatusType;
}

export interface Config<T = any> {
	name: string;
	initialData: T;
	// loader: (data: T) => Promise<T>;
	actions?: {
		[key: string]: SyncAction<T> | AsyncAction<T>;
	};
}

function isAsync(fn: Function) {
	const async: boolean = fn.constructor.name === 'AsyncFunction';
	return async;
}

function extendState<T>(initialState: T): ExtendedState<T> {
	return {
		data: initialState,
		status: DEFAULT_STATUS,
	};
}

/**
 * Helper for merging state with status and optional payload
 */
function combineStateWithStatus<T>(state: T, status: StatusType, payload: any = {}) {
	return {
		...state,
		...payload,
		status,
	};
}

type VReduxReducer<T> = (state: ExtendedState<T> | undefined, action: AnyAction) => ExtendedState<T>;
/**
 * Main create reducer method
 *
 * @param config
 */
export function createReducer<T = any>(config: Config<T>): VReduxReducer<T> {
	const { initialData, actions } = config;
	const initialState = extendState(initialData);

	/**
	 *
	 * Reducer method
	 *
	 */
	return function (state: ExtendedState<T> = initialState, _action: AnyAction) {
		const action = _action as Action<T>;

		/**
		 * Verify if action is valid, and module has a definied actions
		 * As a typical reducer, it gets whole redux data flow with every action,
		 * so the most important thing is to check if action is adressing to current module (reducer).
		 */
		const isValidAction = Boolean(action.fnName);
		const isModuleHasDefiniedActions = actions && Object.keys(actions).length > 0;
		const isCurrentModuleAction = action.module === config.name;

		/**
		 * Check config and actions and start reducing if both are valid.
		 */
		if (isModuleHasDefiniedActions && isValidAction && isCurrentModuleAction) {
			const actionFunction = actions![action.fnName];
			const isValidActionFunction = Boolean(actionFunction);
			const isAsyncAction = action.async && action.suffix;

			if (isValidActionFunction) {
				/**
				 * Handle as ASYNC function
				 *
				 * Suffix is determine how is current status of async action.
				 * Output data is combined with status and provided paylaod.
				 *
				 *
				 * ! There is an issue with action type recognition !
				 *
				 */
				if (isAsyncAction) {
					const { suffix } = action;
					switch (suffix as ActionType) {
						case ACTIONS.REQUEST:
							return combineStateWithStatus(state, STATUSES.FETCHING);
						case ACTIONS.SUCCESS:
							return state;
						case ACTIONS.FETCH:
							return combineStateWithStatus(state, STATUSES.FETCHED, { data: { ...state.data, ...action.payload } });
						case ACTIONS.FAILURE:
							return combineStateWithStatus(state, STATUSES.ERROR);
						default:
							return state;
					}
				} else {
					/**
					 * Handle as SYNC function.
					 * Next state value will be just equal to @actionFunction returned value
					 */
					return {
						data: (<SyncAction<T>>actionFunction)(state.data, action.payload),
						status: 'FETCHED',
					};
				}
			}
		}
		return state;
	};
}

/**
 * Create redux actions, based on config.
 */
export function createActions<T, S = []>(config: Config<T>): VReduxActions<T> {
	const { actions, name: moduleName } = config;

	/**
	 *
	 * Output actions is an object with created redux actions, based on VRedux actions specified in config.
	 *
	 */
	const outputActions: VReduxActions<T> = {};

	function createOutputAction<T>(baseAction: Action<T>, modifier: Partial<Action<T>>): Action<T> {
		return {
			...baseAction,
			type: `${baseAction.module.toUpperCase()}_${baseAction.fnName.toUpperCase()}${modifier.suffix ? `_${modifier.suffix}` : ''}`,
			...modifier,
		};
	}

	/**
	 * Check if config has a @actions property.
	 *
	 *
	 */
	if (actions) {
		Object.entries(actions).forEach(([actionName, fn]) => {
			const actionFn = fn as SyncAction<T> | AsyncAction<T>;

			/**
			 * There is a issue with detect 'async' action base on
			 * function syntax. After babel transpilation typical
			 * way to detect it not working propertly.
			 *
			 * Temporary forced async.
			 *
			 */

			const isAsyncAction = true;
			// const isAsyncAction = isAsync(actionFn);

			// ALL ACTIONS ARE NOW PERFORMED AS ASYNC!!!!!
			// ALL ACTIONS ARE NOW PERFORMED AS ASYNC!!!!!
			// ALL ACTIONS ARE NOW PERFORMED AS ASYNC!!!!!
			// ALL ACTIONS ARE NOW PERFORMED AS ASYNC!!!!!
			// ALL ACTIONS ARE NOW PERFORMED AS ASYNC!!!!!

			if (actionFn && isAsyncAction) {
				/**
				 * Action is specified as ASYNC action.
				 *
				 * To handle it we are using ReduxThunk middleware.                    *
				 *
				 * We creating new Redux action based on module config and VRedux action definition.
				 * In argument we get @inputPayload , which represents input custom data, then we returns async thunk function.
				 *
				 *
				 *
				 * This action will be directly dispatching in redux.
				 *
				 */
				outputActions[actionName] =
					(inputPayload: Partial<T> = {}) =>
					async (dispatch: Dispatch<Action>, getState) => {
						/**
						 *
						 * Initial base of output action, based on module config.
						 * It's using some custom properties to be recognized and handled by universal VRedux reducer
						 *
						 */
						const outputActionBase: Action<T> = {
							module: moduleName,
							type: actionName,
							fnName: actionName,
							async: true,
							payload: {}, // here is the output payload
						};

						dispatch(createOutputAction(outputActionBase, { suffix: ACTIONS.REQUEST }));

						try {
							const moduleState = getState()[moduleName] || {};
							const response = await (actionFn as AsyncAction<T>)((moduleState || {}).data, inputPayload);
							dispatch(createOutputAction(outputActionBase, { suffix: ACTIONS.SUCCESS }));
							dispatch(createOutputAction(outputActionBase, { suffix: ACTIONS.FETCH, payload: response }));
							// return Promise.resolve(response);
						} catch (err: any) {
							dispatch({ ...outputActionBase, type: `${moduleName.toUpperCase()}_${actionName.toUpperCase()}_FAILURE`, suffix: 'FAILURE', payload: { err } });
							// return Promise.reject(err);
						}
					};
			} else {
				// Sync action
				outputActions[actionName] = (payload: Partial<T> = {}) => ({
					module: moduleName,
					fnName: actionName,
					type: `${moduleName.toUpperCase()}_${actionName.toUpperCase()}`,
					async: false,
					payload,
				});
			}
		});
	}

	return outputActions;
}

/**
 *
 *          MODULE
 *
 */
interface VReduxModule<T> {
	reducer: VReduxReducer<T>;
	actions: VReduxActions<T>;
}

export function createModule<T = any>(config: Config<T>): VReduxModule<T> {
	const reducer = createReducer<T>(config);
	const actions = createActions<T>(config);

	return {
		reducer,
		actions,
	};
}

export function isFetched(status: StatusType) {
	return status === STATUSES.FETCHED;
}

export function isFetching(status: StatusType) {
	return status === STATUSES.FETCHING;
}
