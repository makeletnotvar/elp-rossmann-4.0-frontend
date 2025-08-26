import { IModule } from 'redux-dynamic-modules';
import userReducer, { UserState } from './user';

export const userReducers: UserRootState = {
	user: userReducer as any,
};

export interface UserRootState {
	user: UserState;
}

export const getUserModule = (): IModule<UserRootState> => ({
	id: 'user',
	reducerMap: {
		user: userReducer,
	},
	initialActions: [{ type: 'INIT_USER_MODULE' }],
});
