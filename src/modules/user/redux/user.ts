import { API } from 'api/axios';
import userAPI from 'api/endpoints/usersAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { useDispatchOnce } from 'modules/common/helpers/redux/useActions';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { UserRootState } from 'modules/user/redux';
import { AnyAction, Dispatch } from 'redux';

const USER_MODULE = 'user/user';

export interface UserResponse {
	user: User | null;
	message?: string;
}

const REQUEST = USER_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = USER_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = USER_MODULE + '_RESPONSE_FAILURE';
const FETCH = USER_MODULE + '_FETCH';
const RESET = USER_MODULE + '_RESET';
const UPDATE = USER_MODULE + '_UPDATE';

export interface UserState extends AsyncReducerState {
	user: User | null;
}

const initialState: UserState = {
	user: null,
	...defaultAsyncReducerState,
};

const userReducer = (state = initialState, action: AnyAction): UserState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, user: action.payload.user };
		case RESET:
			return initialState;
		case UPDATE:
			return { ...state, user: { ...state.user, ...action.payload.user } };

		default:
			return state;
	}
};

const actions = {
	get: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<UserResponse>(userAPI.getUser(uuid));
				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: UserResponse): ReduxAction<UserResponse> => {
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
	update: (user: User) => {
		return {
			type: UPDATE,
			payload: { user },
		};
	},
};

// HOOKS
const selectUser = (state: UserRootState): UserState => state.user;

export const useUserState = (): UserState => {
	return useSelector<UserRootState, UserState>(selectUser);
};

export const useUser = (uuid: string) => {
	const { user, fetched, fetching } = useUserState();
	const shouldLoad = () => Boolean(!fetched) && uuid !== 'add' && uuid !== undefined;
	useDispatchOnce(actions.get.request(uuid), [], shouldLoad);
	return { user, fetched, fetching };
};

export default userReducer;
export const userActions = actions;
