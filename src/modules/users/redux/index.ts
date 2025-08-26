import { IModule } from 'redux-dynamic-modules';
import usersReducer, { UsersState } from './users';

export const viewsReducers: UsersRootState = {
    users: (usersReducer as any)
};

export interface UsersRootState {
    [x: string]: UsersState;
    users: UsersState;
}

export const getUsersModule = (): IModule<UsersRootState> => ({
        id: "users",
        reducerMap: {
            users: usersReducer,
        },
        initialActions: [
            {type: 'INIT_USERS_MODULE'}
        ]
});