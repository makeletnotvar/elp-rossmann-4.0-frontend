import { useNotifications, notificationsActions } from "modules/common/redux/notifications";
import { useEffect } from "react";
import { useDispatch } from "modules/common/helpers/redux/useActions";
import config from "config/config";

let POLL_COUNT_INTERVAL: NodeJS.Timer;

export function useNotificationsCount() {
    const { data: { count }, status } = useNotifications();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(notificationsActions.fetchCount());
        POLL_COUNT_INTERVAL = setInterval(() => dispatch(notificationsActions.fetchCount()), config.NOTIFICATIONS_POLL_INTERVAL_MS);
        return () => { clearInterval(POLL_COUNT_INTERVAL) }
    }, []);

    return {
        count,
        status
    }
}
