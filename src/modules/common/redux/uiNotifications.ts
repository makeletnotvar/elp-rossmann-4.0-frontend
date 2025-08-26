import useSelector from "modules/common/helpers/redux/useSelector";
import { RootState } from "modules/common/redux";
import { Config, createModule } from "vredux";

export interface UINotificationsData {
    notifications: UINotification[];
}



const config: Config<UINotificationsData> = {
    name: 'uiNotifications',
    initialData: {
        notifications: [],
    },
    actions: {
        'add': async (data, notification) => {
            const nextUniqueId = Math.max(...[...data.notifications.map(n => n.id || 0), 0]) + 1;
            return {
                ...data,
                notifications: [
                    {
                        ...notification,
                        id: nextUniqueId
                    }
                ]
            }
        },
        'remove': async (data, id) => {
            return {
                ...data,
                notifications: data.notifications.filter(notification => notification.id === id)
            }
        }
    }
}

export const { reducer: UINotificationsReducer, actions: UINotificationsActions } = createModule<UINotificationsData>(config);
export const useUINotifications = () => useSelector((state: RootState) => state.uiNotifications);