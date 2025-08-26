import { DevicesOtherOutlined } from '@mui/icons-material';
import { dateString } from 'helpers/date';
import BuildingListAlarmsCellContainer from 'modules/buildings/components/BuildingsList/custom/BuildingListAlarmsCell/BuildingListAlarmsCellContainer';
import BuildingListCommunicationCell from 'modules/buildings/components/BuildingsList/custom/BuildingListCommunicationCell';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import MediaListRowActions from 'modules/media/components/MediaList/MediaListRowActions';
import MediaTitleBar from 'modules/media/components/MediaTitleBar/MediaTitleBar';
import { useMediaDevicesListPaginationRouter } from 'modules/media/hooks/MediaListHooks';
import { useMediaDevicesState } from 'modules/media/redux/mediaDevices';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './MediaList.module.scss';

const columns: SuperTableDataColumns<DetailedDevice> = {
	name: {
		label: 'devices.params.name',
		custom: ({ value, row }) => (
			<Link className={styles.deviceLink} to={`/media/${row.uuid}/readings/total`}>
				{value}
			</Link>
		),
	},
	alarmsCount: {
		label: 'project.alarms',
		// async: true,
		custom: BuildingListAlarmsCellContainer,
		align: 'center',
		title: 'Liczba alarmów',
	},
	connection: {
		label: 'devices.params.connection',
		align: 'center',
		custom: BuildingListCommunicationCell,
	},
	lastSync: {
		label: 'devices.params.lastSync',
		custom: ({ value }) => <>{dateString(value)}</>,
	},
};

interface MediaListProps {}

const MediaList: React.FC<MediaListProps> = () => {
	const { update, dir, offset, q, rowsPerPage, param, activeFilters } = useMediaDevicesListPaginationRouter();
	const { mediaDevices, fetching, count } = useMediaDevicesState();
	const { t } = useTranslation();

	const updateSettingsHandler = (ob: Partial<SuperTableDisplaySettings>): void => {
		update(convertPaginationRouteProps(ob));
	};

	return (
		<div className={styles.container}>
			<MediaTitleBar label={t('media.media_list')} icon={DevicesOtherOutlined} />
			<Content>
				<SuperTable
					activeFilterColumns={activeFilters.map(p => p[0].substr(2))}
					columns={columns}
					data={mediaDevices}
					fetching={fetching}
					checkable={false}
					sortable={true}
					sortingDir={dir}
					sortingParam={param}
					rowsPerPage={rowsPerPage}
					offset={offset}
					count={count}
					onUpdateSettings={updateSettingsHandler}
					query={q}
					noResults={q.length > 0 && mediaDevices.length === 0}
					translator={t}
					rowActions={MediaListRowActions}
				/>
			</Content>
		</div>
	);
};

export default MediaList;
