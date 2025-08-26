import { IconButton, SwipeableDrawer, Tooltip } from '@mui/material';
import { NotificationsOutlined } from '@mui/icons-material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StatusType } from 'vredux';
import NotificationsList from './NotificationsList';
import styles from './NotificationsList.module.scss';

export interface NotificationsListLayoutProps {
	onClose: () => void;
	notifications: Notification[];
	status: StatusType;
	count: number;
	onRead: (uuid: string) => void;
	onReadAll: () => void;
}

const NotificationsListLayout: React.FC<NotificationsListLayoutProps> = ({ onClose, notifications, status, count, onRead, onReadAll }) => {
	const { t } = useTranslation();

	const unreadNotifications = notifications.filter(n => !n.read);
	const readNotifications = notifications.filter(n => !!n.read);

	return (
		<SwipeableDrawer anchor='right' open={true} onClose={onClose} onOpen={console.log} className={styles.drawer}>
			<div className={styles.container}>
				<div className={styles.title}>
					<span>
						{t('notifications.your_active_notifications')} ({count})
					</span>
					<Tooltip title={t('notifications.double_click_to_mark_all_as_read')} placement='left'>
						<IconButton onDoubleClick={onReadAll}>
							<NotificationsOutlined />
						</IconButton>
					</Tooltip>
				</div>
			</div>
			<div className={styles.listsWrapper}>
				{unreadNotifications.length > 0 && (
					<>
						<div className={styles.listTitle}>{t('notifications.status_unread')}</div>
						<NotificationsList notifications={unreadNotifications} status={status} onRead={onRead} />
					</>
				)}
				{readNotifications.length > 0 && (
					<>
						<div className={styles.listTitle}>{t('notifications.status_read')}</div>
						<NotificationsList notifications={readNotifications} status={status} />
					</>
				)}
			</div>
		</SwipeableDrawer>
	);
};

export default NotificationsListLayout;
