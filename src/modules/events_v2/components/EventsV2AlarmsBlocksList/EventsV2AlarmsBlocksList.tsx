import classNames from 'classnames';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import EventsV2AlarmsBlocksListItemActiveCell from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListItem/EventsV2AlarmsBlocksListItemActiveCell';
import EventsV2AlarmsBlocksListItemBuildingCell from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListItem/EventsV2AlarmsBlocksListItemBuildingCell';
import EventsV2AlarmsBlocksListItemCommentCell from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListItem/EventsV2AlarmsBlocksListItemCommentCell';
import EventsV2AlarmsBlocksListItemTypeCell from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListItem/EventsV2AlarmsBlocksListItemTypeCell';
import { ElpEventV2AlarmBlockIdentifyProps } from 'modules/events_v2/interfaces/eventV2-alarm-block-identify.interface';
import { ElpEventV2AlarmBlockInstance } from 'modules/events_v2/interfaces/eventV2-alarm-block-instance.interface';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import EventsV2ListItemDateCell from '../EventsV2List/EventsV2ListItem/EventsV2ListItemDateCell';
import styles from './EventsV2AlarmsBlocksList.module.scss';
import EventsV2AlarmBlocksListRowActions from './EventsV2AlarmsBlocksListRowActions';

interface EventsV2AlarmsBlocksListProps {
	alarmsblocks: ElpEventV2AlarmBlockInstance[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	count: number;
	activeFiltersColumns: string[];
	onEventAlarmBlockDetailsDialog: (uuid: string) => void;
	onDelete: (deleteAlarmBlock: ElpEventV2AlarmBlockIdentifyProps) => void;
	buildingUUID?: string;
}

const columns: SuperTableDataColumns<ElpEventV2> = {
	isActive: {
		label: 'alarmsblocks.params.isActive',
		custom: EventsV2AlarmsBlocksListItemActiveCell,
		tdClassName: styles.active,
		align: 'center',
	},
	name: {
		label: 'alarmsblocks.params.name',
	},
	building: {
		label: 'alarmsblocks.params.building',
		custom: EventsV2AlarmsBlocksListItemBuildingCell,
		disabledSorting: true,
	},
	reason: {
		label: 'alarmsblocks.params.type',
		custom: EventsV2AlarmsBlocksListItemTypeCell,
	},
	time: {
		label: 'alarmsblocks.params.time',
		custom: ({ value }) => (value ? <>{value} dni</> : 'Na stałe'),
	},
	startTs: {
		label: 'alarmsblocks.params.startTs',
		custom: EventsV2ListItemDateCell,
	},
	user: {
		label: 'alarmsblocks.params.user',
		align: 'center',
		tdClassName: styles.user,
	},
	comment: {
		label: 'alarmsblocks.params.comment',
		custom: EventsV2AlarmsBlocksListItemCommentCell,
		align: 'center',
		tdClassName: styles.comment,
	},
};

const rowClassNameProvider = (rowData: ElpEventV2): string => {
	return rowData.isActive ? styles.activeEventRow : '';
};

const EventsV2AlarmsBlocksList: React.FC<EventsV2AlarmsBlocksListProps> = ({
	alarmsblocks,
	count,
	settings,
	onChangeSettings,
	fetching,
	activeFiltersColumns,
	onEventAlarmBlockDetailsDialog,
	onDelete,
	buildingUUID,
}) => {
	const { t } = useTranslation();
	const { query, rowsPerPage, sortingParam, sortingDir, offset } = settings;

	return (
		<div className={classNames(styles.container, { [styles.isBuilding]: buildingUUID })}>
			<SuperTable
				data={alarmsblocks}
				columns={columns}
				fetching={fetching}
				onUpdateSettings={onChangeSettings}
				translator={t}
				sortable={true}
				className={styles.table}
				wrapperClassName={classNames(styles.wrapper, { [styles.isBuilding]: buildingUUID })}
				rowClassName={rowClassNameProvider}
				activeFilterColumns={activeFiltersColumns}
				rowActions={rowData => (
					<EventsV2AlarmBlocksListRowActions rowData={rowData} onEventAlarmBlockDetailsDialog={onEventAlarmBlockDetailsDialog} onDelete={onDelete} />
				)}
				{...{
					query,
					rowsPerPage,
					sortingParam,
					sortingDir,
					offset,
					pagination: true,
					count: count,
				}}
			/>
		</div>
	);
};

export default EventsV2AlarmsBlocksList;
