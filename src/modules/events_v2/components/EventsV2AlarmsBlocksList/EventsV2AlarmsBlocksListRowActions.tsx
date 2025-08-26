import { DeleteOutlined, InfoOutlined } from '@mui/icons-material';
import { t } from 'i18next';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import { CustomContextMenuItemProps } from 'modules/common/components/CustomContextMenu/CustomContextMenu';
import SuperTableContextMenu from 'modules/common/components/Layout/SuperTable/SuperTableContextMenu';
import { ElpEventV2AlarmBlockInstance } from 'modules/events_v2/interfaces/eventV2-alarm-block-instance.interface';

interface EventsV2AlarmBlocksListRowActionsProps {
	onEventAlarmBlockDetailsDialog: any;
	onDelete: any;
	rowData: Partial<ElpEventV2AlarmBlockInstance>;
}

const EventsV2AlarmBlocksListRowActions: React.FC<EventsV2AlarmBlocksListRowActionsProps> = ({ rowData, onDelete, onEventAlarmBlockDetailsDialog }) => {
	const menuItems: CustomContextMenuItemProps[] = [
		{
			label: t('alarmsblocks.params.details'),
			icon: InfoOutlined,
			onClick: () => onEventAlarmBlockDetailsDialog(rowData?.code),
			devOrAdminOnly: true,
		},
		{
			label: t('alarmsblocks.params.deleteAlarmBlock'),
			icon: DeleteOutlined,
			onClick: () =>
				rowData?.device &&
				onDelete({
					deviceUUID: rowData?.device?.uuid,
					code: rowData?.code,
				}),
			devOrAdminOnly: true,
		},
	];

	return (
		<AuthDevOrAdmin>
			<SuperTableContextMenu rowData={rowData} menuItems={menuItems} />
		</AuthDevOrAdmin>
	);
};

export default EventsV2AlarmBlocksListRowActions;
