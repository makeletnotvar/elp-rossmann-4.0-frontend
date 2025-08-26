import { InfoOutlined, NotificationsOffOutlined, SettingsOutlined } from '@mui/icons-material';
import { CustomContextMenuItemProps } from 'modules/common/components/CustomContextMenu/CustomContextMenu';
import SuperTableContextMenu from 'modules/common/components/Layout/SuperTable/SuperTableContextMenu';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';

interface EventsV2ListRowActionsProps {
	onEventDetailsDialog: any;
	onEventConfirmDialog: any;
	rowData: Partial<ElpEventV2>;
	tab: 'active' | 'history';
}

const EventsV2ListRowActions: React.FC<EventsV2ListRowActionsProps> = ({ onEventDetailsDialog, onEventConfirmDialog, rowData, tab }) => {
	const { t } = useTranslation();
	const { history } = useRouter();

	const menuItems: CustomContextMenuItemProps[] = [
		{
			label: t('events.params.details'),
			icon: InfoOutlined,
			onClick: () => onEventDetailsDialog(rowData.uuid),
			hideSeparator: true,
		},
		{
			label: t('events.params.stopAlarm'),
			icon: NotificationsOffOutlined,
			onClick: () => onEventConfirmDialog(rowData.uuid, 'confirm'),
			devOrAdminOnly: true,
		},
		{
			label: t('events.params.configAlarm'),
			icon: SettingsOutlined,
			onClick: () =>
				history.push(`/alarmsConfig?code=${rowData.code}&name=${rowData.name}&priority=${rowData.priority}&isBlocking=${rowData.acknowledgeable}&d=asc&p=code`),
			devOnly: true,
		},
	];

	return <SuperTableContextMenu rowData={rowData} tab={tab} menuItems={menuItems} />;
};

export default EventsV2ListRowActions;
