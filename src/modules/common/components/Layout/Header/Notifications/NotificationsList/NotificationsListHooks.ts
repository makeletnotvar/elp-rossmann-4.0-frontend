import { useDispatch } from "modules/common/helpers/redux/useActions";
import { notificationsActions, useNotifications } from "modules/common/redux/notifications";
import { useEffect, useCallback } from "react";

export function useNotificationsList(){
    const dispatch = useDispatch();
    const { data: {notifications, count}, status  } = useNotifications();

    useEffect(() => {
        dispatch(notificationsActions.fetch());
    }, [])

    const readHandler = useCallback((uuid: string) => {
        dispatch(notificationsActions.read([uuid]));
    }, []);

    const readAllHandler = useCallback(() => {
        dispatch(notificationsActions.readAll())
    }, []);
 
    return {
        notifications,
        count,
        status,
        readHandler,
        readAllHandler
    }
}