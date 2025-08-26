import { useNotificationsList } from 'modules/common/components/Layout/Header/Notifications/NotificationsList/NotificationsListHooks';
import NotificationsListLayout from 'modules/common/components/Layout/Header/Notifications/NotificationsList/NotificationsListLayout';
import * as React from 'react';

interface NotificationsListContainerProps {
	onClose: () => void;
}

const NotificationsListContainer: React.FC<NotificationsListContainerProps> = ({ onClose }) => {
	const { notifications, count, status, readHandler, readAllHandler } = useNotificationsList();
	return (
		<NotificationsListLayout onClose={onClose} count={count} notifications={notifications} status={status} onRead={readHandler} onReadAll={readAllHandler} />
	);
};

export default NotificationsListContainer;
