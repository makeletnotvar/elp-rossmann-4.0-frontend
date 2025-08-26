import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import DateCell from 'modules/common/components/Tables/DateCell';
import MediaEventsListItemActiveCell from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListItem/MediaEventsListItemActiveCell';
import MediaEventsListItemActiveTimeRangeCell from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListItem/MediaEventsListItemActiveTimeRangeCell';
import MediaEventsListItemDeviceCell from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListItem/MediaEventsListItemDeviceCell';
import MediaEventsListItemPriorityCell from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListItem/MediaEventsListItemPriorityCell';
import MediaEventsListItemTypeCell from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListItem/MediaEventsListItemTypeCell';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaEventsList.module.scss';

interface MediaEventsListProps {
	mediaEvents: ElpEvent[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	count: number;
	onEventDetails: (uuid: string) => void;
	activeFiltersColumns: string[];
}

const columns: SuperTableDataColumns<ElpEvent> = {
	type: {
		label: 'media.params.type',
		custom: MediaEventsListItemTypeCell,
		align: 'right',
		tdClassName: styles.type,
		disabledSorting: true,
	},
	priority: {
		label: 'media.params.priority',
		custom: MediaEventsListItemPriorityCell,
		align: 'center',
		tdClassName: styles.level,
	},
	device: {
		label: 'media.params.device',
		custom: MediaEventsListItemDeviceCell,
	},
	name: {
		label: 'media.params.name',
		tdClassName: styles.name,
	},
	isActive: {
		label: 'media.params.active',
		custom: MediaEventsListItemActiveCell,
		tdClassName: styles.active,
	},
	activeTs: {
		label: 'media.params.activeTime',
		custom: DateCell,
		tdClassName: styles.status,
		align: 'right',
	},
	deactiveTs: {
		label: 'media.params.deactiveTime',
		custom: DateCell,
		align: 'right',
	},
	activeTimeRange: {
		label: 'media.params.duration',
		custom: MediaEventsListItemActiveTimeRangeCell,
		disabledSorting: true,
		align: 'right',
	},
};

const MediaEventsList: React.FC<MediaEventsListProps> = ({
	mediaEvents,
	count,
	settings,
	onChangeSettings,
	fetching,
	onEventDetails,
	activeFiltersColumns,
}) => {
	const { t } = useTranslation();
	const { query, rowsPerPage, sortingParam, sortingDir, offset } = settings;

	return (
		<div className={styles.container}>
			<Content>
				<SuperTable
					className={styles.table}
					wrapperClassName={styles.wrapper}
					paginationClassName={styles.pagination}
					columns={columns}
					data={mediaEvents}
					fetching={fetching}
					checkable={false}
					sortable={true}
					sortingDir={sortingDir}
					sortingParam={sortingParam}
					rowsPerPage={rowsPerPage}
					offset={offset}
					count={count}
					onUpdateSettings={onChangeSettings}
					query={query}
					noResults={query ? query.length > 0 && mediaEvents.length === 0 : false}
					translator={t}
					rowActions={EventRowActions(onEventDetails)}
					activeFilterColumns={activeFiltersColumns}
				/>
			</Content>
		</div>
	);
};

const EventRowActions = (onEventDetails: any) => (rowData: Partial<ElpEvent>) => {
	return (
		<IconButton size='small' onClick={() => onEventDetails(rowData.uuid)}>
			<MoreHorizOutlined fontSize='inherit' />
		</IconButton>
	);
};

export default MediaEventsList;
