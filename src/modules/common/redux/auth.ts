import { API } from 'api/axios';
import authAPI from 'api/endpoints/authAPI';
import { clearSessionStorageUser, getSessionStorageUser, setSessionStorageUser } from 'modules/common/auth/storage';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { AnyAction, Dispatch } from 'redux';

export interface AuthState extends AsyncReducerState {
	user: UserAuth | null;
	errorMessage?: string;
	veryfing: boolean;
	verified: boolean;
}

const initialState: AuthState = {
	user: null,
	veryfing: false,
	verified: false,
	...defaultAsyncReducerState,
};

const AUTH_MODULE = 'common/auth/';

const LOGIN_REQUEST = AUTH_MODULE + 'LOGIN_REQUEST';
const LOGIN_RESPONSE_SUCCESS = AUTH_MODULE + 'LOGIN_RESPONSE_SUCCESS';
const LOGIN_RESPONSE_FAILURE = AUTH_MODULE + 'LOGIN_RESPONSE_FAILURE';
const LOGIN_FETCH = AUTH_MODULE + 'LOGIN_FETCH';

// User
const VERIFY_REQUEST = AUTH_MODULE + 'VERIFY_REQUEST';
const VERIFY_RESPONSE_SUCCESS = AUTH_MODULE + 'VERIFY_RESPONSE_SUCCESS';
const VERIFY_RESPONSE_FAILURE = AUTH_MODULE + 'VERIFY_RESPONSE_FAILURE';
const VERIFY_FETCH = AUTH_MODULE + 'VERIFY_FETCH';

// User
const LOGOUT_REQUEST = AUTH_MODULE + 'LOGOUT_REQUEST';
const LOGOUT_RESPONSE_SUCCESS = AUTH_MODULE + 'LOGOUT_RESPONSE_SUCCESS';
const LOGOUT_FETCH = AUTH_MODULE + 'LOGOUT_FETCH';

const authReducer = (state = initialState, action: AnyAction): AuthState => {
	switch (action.type) {
		case LOGIN_REQUEST:
			return { ...state, fetching: true };
		case VERIFY_REQUEST:
			return { ...state, veryfing: true };
		case LOGIN_RESPONSE_SUCCESS:
			return { ...state, error: false, fetching: false, errorMessage: '' };
		case LOGIN_RESPONSE_FAILURE:
			return { ...state, error: true, fetching: false, errorMessage: action.payload.errorMessage };
		case LOGIN_FETCH:
			return {
				...state,
				user: action.payload.user,
				fetched: true,
			};
		case VERIFY_RESPONSE_SUCCESS: {
			return {
				...state,
				verified: true,
				veryfing: false,
			};
		}
		case VERIFY_FETCH:
			return {
				...state,
				user: action.payload.user,
				fetched: true,
			};
		case VERIFY_RESPONSE_FAILURE: {
			return {
				...state,
				verified: false,
				veryfing: false,
				error: true,
				fetching: false,
			};
		}
		default:
			return state;
	}
};

interface LoginResponse {
	user: UserAuth | null;
}

export const actions = {
	login: {
		request: (username: string, password: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: LOGIN_REQUEST });
			try {
				const loginResponse = await API.post<LoginResponse>(authAPI.login(), { username, password });
				dispatch(actions.login.success());
				dispatch(actions.login.fetch(loginResponse.data));
			} catch (error: any) {
				clearSessionStorageUser();
				if (error && error.response && error.response.status) {
					dispatch(actions.login.failure(`auth.events.${error.response.status}`));
				} else {
					dispatch(actions.login.failure(`auth.events.not_found`));
				}
			}
		},
		success: () => {
			return { type: LOGIN_RESPONSE_SUCCESS };
		},
		failure: (errorMessage: string) => ({
			type: LOGIN_RESPONSE_FAILURE,
			payload: { errorMessage },
		}),
		fetch: (response: LoginResponse) => {
			response.user && setSessionStorageUser(response.user.username);
			return {
				type: LOGIN_FETCH,
				payload: {
					user: response.user,
				},
			};
		},
	},
	verify: {
		request: () => async (dispatch: Dispatch<any>) => {
			dispatch({ type: VERIFY_REQUEST });
			const username = getSessionStorageUser();

			try {
				const loginResponse = await API.post<LoginResponse>(authAPI.verify(), { username });
				dispatch(actions.verify.success());
				dispatch(actions.verify.fetch(loginResponse.data));
			} catch (error) {
				dispatch(actions.verify.failure());
				if (!window.location.href.includes('/login')) window.location.href = '/login';
			}
		},
		failure: () => ({ type: VERIFY_RESPONSE_FAILURE }),
		success: () => ({ type: VERIFY_RESPONSE_SUCCESS }),
		fetch: (response: LoginResponse) => {
			return {
				type: VERIFY_FETCH,
				payload: {
					user: response.user,
				},
			};
		},
	},
	logout: {
		request: () => async (dispatch: Dispatch<any>) => {
			dispatch({ type: LOGOUT_REQUEST });
			try {
				const logoutResponse = await API.post(authAPI.logout());
				dispatch(actions.logout.success());
				dispatch(actions.logout.fetch(logoutResponse.data));
			} catch (error) {
				//
			}
			const REDIRECT_TO_LOGIN = true;
			setTimeout(() => clearSessionStorageUser(REDIRECT_TO_LOGIN), 300);
		},
		success: () => {
			return { type: LOGOUT_RESPONSE_SUCCESS };
		},
		fetch: (response: LoginResponse) => {
			return {
				type: LOGOUT_FETCH,
			};
		},
	},
};

export default authReducer;
export const authActions = actions;
