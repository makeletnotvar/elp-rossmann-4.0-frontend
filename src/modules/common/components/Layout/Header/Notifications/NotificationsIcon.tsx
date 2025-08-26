import { Badge, IconButton, Tooltip } from '@mui/material';
import { NotificationsOutlined } from '@mui/icons-material';
import NotificationsListContainer from 'modules/common/components/Layout/Header/Notifications/NotificationsList/NotificationsListContainer';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STATUSES } from 'vredux';
import { useNotificationsCount } from './NotificationsHooks';

interface NotificationsIconProps {}

const NotificationsIcon: React.FC<NotificationsIconProps> = () => {
	const [open, setOpen] = useState<boolean>();
	const { count, status } = useNotificationsCount();
	const { t } = useTranslation();

	const error = status === STATUSES.ERROR;
	const fetched = status === STATUSES.FETCHED;

	const badge = error ? '?' : fetched ? count : '-';

	const title = !error ? t('notifications.you_have_n_new_notifications', { count }) : t('notifications.fetch_error');

	const openHandler = () => {
		if (fetched && !error) {
			setOpen(!open);
		}
	};

	return (
		<>
			<Tooltip title={title} placement='bottom'>
				<IconButton color='inherit' onClick={openHandler}>
					{
						<Badge overlap='rectangular' badgeContent={badge} color='primary'>
							<NotificationsOutlined />
						</Badge>
					}
				</IconButton>
			</Tooltip>
			{open && <NotificationsListContainer onClose={() => setOpen(false)} />}
		</>
	);
};

export default NotificationsIcon;
