import { NotificationsData, notificationsReducer } from 'modules/common/redux/notifications';
import { UINotificationsData, UINotificationsReducer } from 'modules/common/redux/uiNotifications';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';
import appReducer, { AppState } from './app';
import authReducer, { AuthState } from './auth';

export const rootReducers = {
    auth: authReducer,
    app: appReducer,
    notifications: notificationsReducer,
    uiNotifications: UINotificationsReducer,
};

export type RootState = {
    auth: AuthState,
    app: AppState,
    notifications: ExtendedState<NotificationsData>;
    uiNotifications: ExtendedState<UINotificationsData>;
};

export const getRootModule = (): IModule<RootState> => ({
    id: "root",
    reducerMap: rootReducers
}); 