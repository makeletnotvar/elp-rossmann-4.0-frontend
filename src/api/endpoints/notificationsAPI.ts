// @TODO - code organization to serparate endpoints points

import { createUrl } from "api/helpers";
import queryString from 'query-string';

export const notificationsAPI = {
    getActiveNotificationsCount: () => createUrl(`/notifications/count`),
    getActiveNotifications: () => createUrl(`/notifications`),
    makeNoficationsRead: (notificationsUUIDs: string[]) => createUrl(`/notifications/read?${queryString.stringify({ n: notificationsUUIDs })}`)
}

export default notificationsAPI;