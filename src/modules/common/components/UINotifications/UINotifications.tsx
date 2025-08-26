import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect } from 'react';
// const styles = require("./UINotifications.scss");

interface UINotificationsProps {
	notifications: UINotification[];
}

const UINotifications: React.FC<UINotificationsProps> = ({ notifications }) => {
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		notifications.forEach(notification => enqueueSnackbar(notification.message, { variant: notification.variant || 'info' }));
	}, [notifications]);

	return null;
};

export default UINotifications;
