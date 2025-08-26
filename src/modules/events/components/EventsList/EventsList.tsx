import { MoreHorizOutlined, SettingsOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import AlarmsConfigListItemPriorityCell from 'modules/alarmsConfig/components/AlarmsConfigList/AlarmsConfigListItem/AlarmsConfigListItemPriorityCell';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import DateCell from 'modules/common/components/Tables/DateCell';
import EventsListItemAcknowledgeCell from 'modules/events/components/EventsList/EventsListItem/EventsListItemAcknowledgeCell';
import EventsListItemActiveCell from 'modules/events/components/EventsList/EventsListItem/EventsListItemActiveCell';
import EventsListItemActiveTimeRangeCell from 'modules/events/components/EventsList/EventsListItem/EventsListItemActiveTimeRangeCell';
import EventsListItemBuildingCell from 'modules/events/components/EventsList/EventsListItem/EventsListItemBuildingCell';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './EventsList.module.scss';

interface EventsListProps {
	events: ElpEvent[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	count: number;
	onEventDetails: (uuid: string) => void;
	activeFiltersColumns: string[];
}

const columns: SuperTableDataColumns<ElpEvent> = {
	priority: {
		label: 'events.params.priority',
		custom: ({ value }) => <AlarmsConfigListItemPriorityCell value={value} />,
		align: 'center',
		tdClassName: styles.level,
	},
	building: {
		label: 'events.params.building',
		custom: EventsListItemBuildingCell,
		tdClassName: styles.building,
	},
	name: {
		label: 'events.params.name',
		tdClassName: styles.name,
	},
	isActive: {
		label: 'events.params.active',
		custom: EventsListItemActiveCell,
		tdClassName: styles.active,
	},
	acknowledgeable: {
		label: 'events.params.acknowledge',
		custom: EventsListItemAcknowledgeCell,
	},
	activeTs: {
		label: 'events.params.activeTime',
		custom: DateCell,
		tdClassName: styles.status,
		align: 'right',
	},
	deactiveTs: {
		label: 'events.params.deactiveTime',
		custom: DateCell,
		align: 'right',
	},
	activeTimeRange: {
		label: 'events.params.duration',
		custom: EventsListItemActiveTimeRangeCell,
		disabledSorting: true,
		align: 'right',
	},
};

const rowClassNameProvider = (rowData: ElpEvent): string => {
	let classname = '';

	if (rowData.isActive) {
		classname = styles.rowActive;
	}

	return classname;
};

const EventsList: React.FC<EventsListProps> = ({ events, fetching, count, settings, onChangeSettings, onEventDetails, activeFiltersColumns }) => {
	const { t } = useTranslation();
	const { query, rowsPerPage, sortingParam, sortingDir, offset } = settings;

	return (
		<SuperTable
			data={events}
			columns={columns}
			onUpdateSettings={onChangeSettings}
			translator={t}
			fetching={fetching}
			sortable={true}
			rowActions={rowData => <EventRowActions onEventDetails={onEventDetails} rowData={rowData} />}
			rowClassName={rowClassNameProvider}
			activeFilterColumns={activeFiltersColumns}
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
	);
};

interface EventRowActionsProps {
	onEventDetails: any;
	rowData: Partial<ElpEvent>;
}

const EventRowActions: React.FC<EventRowActionsProps> = ({ onEventDetails, rowData }) => {
	const { history } = useRouter();

	return (
		<div className={styles.actions}>
			<AuthDev>
				<Tooltip title='Konfiguracja alamu'>
					<IconButton
						size='small'
						onClick={() =>
							history.push(
								`/alarmsConfig?uuid=${rowData.uuid}&code=${rowData.code}&name=${rowData.name}&priority=${rowData.priority}&isBlocking=${rowData.acknowledgeable}&d=asc&p=code`
							)
						}
					>
						<SettingsOutlined fontSize='inherit' />
					</IconButton>
				</Tooltip>
			</AuthDev>
			<IconButton size='small' onClick={() => onEventDetails(rowData.uuid)}>
				<MoreHorizOutlined fontSize='inherit' />
			</IconButton>
		</div>
	);
};

export default EventsList;
