import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { useDispatchOnce } from 'modules/common/helpers/redux/useActions';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { userActions } from 'modules/user/redux/user';
import { sortUsers } from 'modules/users/helpers/filters';
import { fixUser } from 'modules/users/helpers/fixes';
import { UsersRootState } from 'modules/users/redux';
import { AnyAction, Dispatch } from 'redux';

const USERS_MODULE = 'users/users';

export interface UsersResponse {
	users: User[];
	message?: string;
}

export interface UserResponse {
	user: User;
	message?: string;
}

const REQUEST = USERS_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = USERS_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = USERS_MODULE + '_RESPONSE_FAILURE';
const FETCH = USERS_MODULE + '_FETCH';
const RESET = USERS_MODULE + '_RESET';

const ADD_REQUEST = USERS_MODULE + '_ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = USERS_MODULE + '_ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = USERS_MODULE + '_ADD_RESPONSE_FAILURE';
const ADD_FETCH = USERS_MODULE + '_ADD_FETCH';
const ADD_RESET = USERS_MODULE + '_ADD_RESET';

const UPDATE_REQUEST = USERS_MODULE + '_UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = USERS_MODULE + '_UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = USERS_MODULE + '_UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = USERS_MODULE + '_UPDATE_FETCH';

const REMOVE_REQUEST = USERS_MODULE + '_REMOVE_REQUEST';
const REMOVE_RESPONSE_SUCCESS = USERS_MODULE + '_REMOVE_RESPONSE_SUCESS';
const REMOVE_RESPONSE_FAILURE = USERS_MODULE + '_REMOVE_RESPONSE_FAILURE';
const REMOVE_FETCH = USERS_MODULE + '_REMOVE_FETCH';

export interface UsersState extends AsyncReducerState {
	users: User[];
}

const initialState: UsersState = {
	users: [],
	...defaultAsyncReducerState,
};

const usersReducer = (state = initialState, action: AnyAction): UsersState => {
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
			return { ...state, fetched: true, users: action.payload.users };
		case UPDATE_FETCH:
			return {
				...state,
				fetched: true,
				users: state.users.map(user => {
					return user.uuid === action.payload.user.uuid ? action.payload.user : user;
				}),
			};
		case ADD_FETCH:
			return {
				...state,
				fetched: true,
				users: [...state.users, action.payload.user],
			};
		case REMOVE_FETCH:
			return {
				...state,
				fetched: true,
				users: state.users.filter(user => user.uuid !== action.payload.uuid),
			};
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	get: {
		request: () => async (dispatch: Dispatch<any>, getStore: any) => {
			const { auth } = getStore();
			const username = auth && auth.user ? auth.user.username : '';

			try {
				dispatch({ type: REQUEST });
				const response = await API.get<UsersResponse>(usersAPI.getUsers());
				dispatch(actions.get.success());
				const users = sortUsers(response.data.users, username).map(fixUser);
				dispatch(actions.get.fetch({ users }));
			} catch (err: any) {
				dispatch(actions.get.failure(err as any));
			}
		},
		fetch: (response: UsersResponse): ReduxAction<UsersResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => {
			return { type: RESPONSE_SUCCESS };
		},
		failure: (error: string): AnyAction => {
			return { type: RESPONSE_FAILURE, error: true };
		},
	},
	add: {
		request: (user: UserEditableProps) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: ADD_REQUEST });
			try {
				const response = await API.post<UserResponse>(usersAPI.createUser(), { user });
				dispatch(actions.add.success());
				dispatch(actions.add.fetch(response.data));
				return Promise.resolve(response.data.user);
			} catch (err: any) {
				dispatch(actions.add.failure(err as any));
				return Promise.reject();
			}
		},
		fetch: (response: UserResponse): ReduxAction<UserResponse> => {
			return { type: ADD_FETCH, payload: response };
		},
		success: (): AnyAction => {
			return { type: ADD_RESPONSE_SUCCESS };
		},
		failure: (error: string): AnyAction => {
			return { type: ADD_RESPONSE_FAILURE, error: true };
		},
	},
	update: {
		request: (user: UserEditableProps) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: UPDATE_REQUEST });

			try {
				const response = await API.put<UserResponse>(usersAPI.updateUser(user.uuid), { user });
				dispatch(actions.update.success());
				dispatch(actions.update.fetch(response.data));
				dispatch(userActions.update(response.data.user));
				return Promise.resolve(response.data.user);
			} catch (err: any) {
				dispatch(actions.update.failure(err as any));
				return Promise.reject();
			}
		},
		fetch: (response: UserResponse): ReduxAction<UserResponse> => ({ type: UPDATE_FETCH, payload: response }),
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: UPDATE_RESPONSE_FAILURE, error: true }),
	},
	remove: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: REMOVE_REQUEST });

			try {
				const response = await API.delete<UserResponse>(usersAPI.removeUser(uuid));
				dispatch(actions.remove.success());
				dispatch(actions.remove.fetch(uuid));
				return Promise.resolve();
			} catch (err: any) {
				dispatch(actions.remove.failure(err as any));
				return Promise.reject();
			}
		},
		fetch: (uuid: string): AnyAction => ({ type: REMOVE_FETCH, payload: uuid }),
		success: (): AnyAction => ({ type: REMOVE_RESPONSE_SUCCESS }),
		failure: (error: string): AnyAction => ({ type: REMOVE_RESPONSE_FAILURE, error: true }),
	},
};

// HOOKS
const selectUsers = (state: UsersRootState): UsersState => state.users;

const useUsersState = (): UsersState => {
	return useSelector<UsersRootState, UsersState>(selectUsers);
};

export const useUsers = () => {
	const { users, fetched, fetching } = useUsersState();
	const shouldLoad = () => Boolean(!fetched);
	useDispatchOnce(actions.get.request(), [], shouldLoad);
	return { users, fetched, fetching };
};

export default usersReducer;
export const usersActions = actions;
