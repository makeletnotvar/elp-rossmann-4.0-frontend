import { Paper } from '@mui/material';
import { NotificationsOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { useApp } from 'modules/common/selectors/app';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../BuildingUnitsContent.module.scss';
import BuildingUnitsContentAlarmsItem from './BuildingUnitsContentAlarmsItem';

interface BuildingUnitsContentAlarmsProps {
	buildingUUID: string;
	unitXid: string;
}

const BuildingUnitsContentAlarms: React.FC<BuildingUnitsContentAlarmsProps> = ({ unitXid, buildingUUID }) => {
	const { t } = useTranslation();
	const { events } = useApp();

	const { buildingEvents } = useMemo(() => {
		const buildingEventsFilteredByBuilding = (events || []).filter(event => event.building.uuid === buildingUUID);

		const buildingEventsFilteredByUnitXid = unitXid
			? (buildingEventsFilteredByBuilding || []).filter(event => unitXid?.toLocaleLowerCase() === event.unitXid?.toLocaleLowerCase())
			: [];

		return {
			buildingEvents: buildingEventsFilteredByUnitXid,
		};
	}, [events, buildingUUID, unitXid]);

	return (
		<Paper className={cn(styles.contentAlarms)} elevation={0}>
			<div className={styles.label}>
				<NotificationsOutlined fontSize='inherit' />
				<span>
					{t('buildings.units.active_alarms')} <span style={{ opacity: 0.5 }}>({[].length})</span>
				</span>
			</div>
			<div className={styles.alarmsList}>
				{(buildingEvents || []).length > 0 ? (
					(buildingEvents || []).map((event: BuildingEvent) => <BuildingUnitsContentAlarmsItem key={event.code} event={event} />)
				) : (
					<div className={styles.noResults}>{t('buildings.units.no_active_alarms')}</div>
				)}
			</div>
		</Paper>
	);
};

export default BuildingUnitsContentAlarms;
