import { API } from "api/axios";
import notificationsAPI from "api/endpoints/notificationsAPI";
import useSelector from "modules/common/helpers/redux/useSelector";
import { RootState } from "modules/common/redux";
import { Config, createModule } from "vredux";

export interface NotificationsData {
    count: number;
    notifications: Notification[];
}

export interface NotificationsResponse {
    notifications: Notification[];
}

export interface NotificationsCountResponse {
    count: number;
}

const config: Config<NotificationsData> = {
    name: 'notifications',
    initialData: {
        notifications: [],
        count: -1
    },
    actions: {
        'fetchCount': async (data, payload) => {
            const response = await API.get<NotificationsCountResponse>(notificationsAPI.getActiveNotificationsCount());
            return { ...data, count: response.data.count }
        },
        'fetch': async (data, payload) => {
            const response = await API.get<NotificationsResponse>(notificationsAPI.getActiveNotifications());
            return { ...data, notifications: response.data.notifications }
        },
        'read': async (data, uuids: string[]) => {
            const response = await API.put<NotificationsResponse>(notificationsAPI.makeNoficationsRead(uuids));

            const nextNotifications = [...data.notifications || []].map(notification => {
                const modified = response.data.notifications.find(n => n.uuid === notification.uuid);
                return modified
                    ? modified
                    : notification
            });

            const nextCount = nextNotifications.filter(n => !n.read).length;
            return { ...data, notifications: nextNotifications, count: nextCount }
        },
        'readAll': async (data) => {
            const allUnreadNotificationsUUIDS = data.notifications
                .filter(n => !n.read)
                .map(n => n.uuid)

            const res = await config.actions!.read(data, allUnreadNotificationsUUIDS);
            return res;
        }
    }
}

export const { reducer: notificationsReducer, actions: notificationsActions } = createModule<NotificationsData>(config);
export const useNotifications = () => useSelector((state: RootState) => state.notifications);