import classNames from 'classnames';
import AlarmsConfigListItemPriorityCell from 'modules/alarmsConfig/components/AlarmsConfigList/AlarmsConfigListItem/AlarmsConfigListItemPriorityCell';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import EventsV2ListItemAcknowledgeCell from 'modules/events_v2/components/EventsV2List/EventsV2ListItem/EventsV2ListItemAcknowledgeCell';
import EventsV2ListItemActiveTimeRangeCell from 'modules/events_v2/components/EventsV2List/EventsV2ListItem/EventsV2ListItemActiveTimeRangeCell';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './EventsV2List.module.scss';
import EventsV2ListItemDateCell from './EventsV2ListItem/EventsV2ListItemDateCell';
import EventsV2ListItemUnitCell from './EventsV2ListItem/EventsV2ListItemUnitCell';
import EventsV2ListRowActions from './EventV2sListRowActions';

interface EventsV2ListProps {
	events: ElpEventV2[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	count: number;
	onEventDetailsDialog: (uuid: string) => void;
	onEventConfirmDialog: (uuid: string, confirm: string) => void;
	activeFiltersColumns: string[];
	tab: 'active' | 'history';
	buildingUUID?: string;
}

const getDynamicColumns = (tab: 'active' | 'history', history: any, search: any, buildingUUID?: string): SuperTableDataColumns => ({
	priority: {
		label: 'events.params.priority',
		custom: ({ value }) => <AlarmsConfigListItemPriorityCell value={value} />,
		align: 'center',
		tdClassName: styles.level,
		disabledSorting: true,
	},
	name: {
		label: 'events.params.name',
		tdClassName: styles.name,
		searchable: true,
		onClick: (value, row) =>
			history.push(buildingUUID ? `/building/${buildingUUID}/events-v2/${tab}/${row?.uuid}${search}` : `/events-v2/${tab}/${row?.uuid}${search}`),
	},
	unitXid: {
		label: 'events.params.unitXid',
		custom: EventsV2ListItemUnitCell,
		align: 'center',
		tdClassName: styles.level,
	},
	building: {
		label: 'events.params.building',
		tdClassName: styles.building,
		disabledSorting: true,
		onClick: (value, row) => history.push(buildingUUID ? `/building/${buildingUUID}/info` : `/building/${row?.building?.uuid}/info`),
		searchable: true,
	},
	acknowledgeable: {
		label: 'events.params.acknowledge',
		custom: EventsV2ListItemAcknowledgeCell,
	},
	activeTs: {
		label: 'events.params.activeTime',
		custom: EventsV2ListItemDateCell,
		tdClassName: styles.status,
	},
	deactiveTs: {
		label: 'events.params.deactiveTime',
		custom: EventsV2ListItemDateCell,
		hidden: tab === 'active',
		tdClassName: styles.status,
	},
	activeTimeRange: {
		label: 'events.params.duration',
		custom: EventsV2ListItemActiveTimeRangeCell,
		disabledSorting: true,
		hidden: tab === 'active',
		tdClassName: styles.status,
	},
});

const EventsV2List: React.FC<EventsV2ListProps> = ({
	events,
	count,
	settings,
	onChangeSettings,
	fetching,
	onEventDetailsDialog,
	onEventConfirmDialog,
	activeFiltersColumns,
	tab,
	buildingUUID,
}) => {
	const {
		history,
		location: { search },
	} = useRouter();
	const { t } = useTranslation();
	const { query, rowsPerPage, sortingParam, sortingDir, offset } = settings;

	return (
		<div className={classNames(styles.container, { [styles.isBuilding]: buildingUUID })}>
			<SuperTable
				data={events}
				columns={getDynamicColumns(tab, history, search, buildingUUID)}
				fetching={fetching}
				wrapperClassName={classNames(styles.wrapper, { [styles.isBuilding]: buildingUUID })}
				onUpdateSettings={onChangeSettings}
				translator={t}
				sortable={true}
				noResults={(query || '').length > 0 && events.length === 0}
				rowActions={rowData => (
					<EventsV2ListRowActions tab={tab} onEventDetailsDialog={onEventDetailsDialog} onEventConfirmDialog={onEventConfirmDialog} rowData={rowData} />
				)}
				activeFilterColumns={activeFiltersColumns.map(activeColumn => {
					if (activeColumn === 'fromDate') {
						return 'activeTs';
					} else if (activeColumn === 'toDate') {
						return 'deactiveTs';
					} else {
						return activeColumn;
					}
				})}
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

export default EventsV2List;
