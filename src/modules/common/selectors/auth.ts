import { RootState } from '../redux';
import useSelector from '../helpers/redux/useSelector';
import { AuthState } from '../redux/auth';

const selectAuth = (state: RootState) => state.auth;

export const useAuth = (): AuthState => {
    return useSelector<RootState, AuthState>(selectAuth, []);
};

export const useUserType = (): UserType => {
    const {user} = useAuth();
    return user
        ? user.type!
        : null;
}

export const useAccountType = (): AccountType => {
    const {user} = useAuth();
    return user
        ? user.accountType
        : null;
}

export const isAuthenticated = (auth: AuthState) => {
    return auth.user !== null;
};

export const isAuthorized = (auth: AuthState, userType: UserType) => {

    // TODO: complete isAuth
    const isAuth = true;
    
    return isAuthenticated(auth) && isAuth;
};