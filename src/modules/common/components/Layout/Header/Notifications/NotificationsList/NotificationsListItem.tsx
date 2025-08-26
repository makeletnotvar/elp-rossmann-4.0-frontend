import { CheckOutlined, NotificationsOutlined } from '@mui/icons-material';
import { IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Tooltip } from '@mui/material';
import cn from 'classnames';
import { dateString } from 'helpers/date';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NotificationsList.module.scss';

interface NotificationsListItemProps {
	notification: Notification;
	onRead?: (uuid: string) => void;
}

const NotificationsListItem: React.FC<NotificationsListItemProps> = ({ notification, onRead }) => {
	const readHandler = () => {
		onRead && onRead(notification.uuid);
	};

	return (
		<ListItem className={cn(styles.item, { [styles.read]: notification.read })}>
			<ListItemAvatar className={styles.icon}>
				<NotificationsOutlined />
			</ListItemAvatar>
			<div className={styles.column}>
				<ListItemText className={styles.name}>{notification.name}</ListItemText>
				<ListItemText className={styles.time}>{dateString(notification.activeTs)}</ListItemText>
			</div>
			<NotificationsListItemRead read={notification.read} readTs={notification.readTs} onRead={readHandler} />
		</ListItem>
	);
};

interface NotificationsListItemReadProps extends Pick<Notification, 'read' | 'readTs'> {
	onRead: () => void;
}

const NotificationsListItemRead: React.FC<NotificationsListItemReadProps> = ({ read, readTs, onRead }) => {
	const { t } = useTranslation();
	return read ? (
		<span className={styles.readTime}>
			<label>{new Date(readTs).toLocaleDateString()}</label>
			<CheckOutlined />
		</span>
	) : (
		<ListItemSecondaryAction>
			<Tooltip title={t('notifications.mark_as_read')} aria-label='add' placement='left'>
				<IconButton size='small' onClick={onRead}>
					<CheckOutlined />
				</IconButton>
			</Tooltip>
		</ListItemSecondaryAction>
	);
};

export default NotificationsListItem;
