import { List } from '@mui/material';
import NotificationsListItem from 'modules/common/components/Layout/Header/Notifications/NotificationsList/NotificationsListItem';
import { NotificationsListLayoutProps } from 'modules/common/components/Layout/Header/Notifications/NotificationsList/NotificationsListLayout';
import * as React from 'react';
import styles from './NotificationsList.module.scss';

interface NotificationsListProps extends Pick<NotificationsListLayoutProps, 'notifications' | 'status'> {
	onRead?: (uuid: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notifications, onRead }) => {
	return (
		<List className={styles.list}>
			{notifications
				.sort((a, b) => b.activeTs - a.activeTs)
				.slice(0, 100)
				.map(notification => (
					<NotificationsListItem notification={notification} key={notification.uuid} onRead={onRead} />
				))}
		</List>
	);
};

export default NotificationsList;
