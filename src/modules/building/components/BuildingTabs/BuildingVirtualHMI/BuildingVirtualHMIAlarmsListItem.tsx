import { Paper, Tooltip } from '@mui/material';
import cn from 'classnames';
import EventsV2ListItemPriorityCell from 'modules/events_v2/components/EventsV2List/EventsV2ListItem/EventsV2ListItemPriorityCell';
import useEventV2DurationTime from 'modules/events_v2/hooks/useEventV2DurationTime';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingVirtualHMI.module.scss';

interface BuildingVirtualHMIAlarmsListItemProps {
	event: DeviceEvents;
}

const BuildingVirtualHMIAlarmsListItem: React.FC<BuildingVirtualHMIAlarmsListItemProps> = ({ event }) => {
	const { t } = useTranslation();
	const eventDurationTime = useEventV2DurationTime(event.activeTs, moment(moment.now()).valueOf());
	const eventPriorityClassName = styles[(event.priority || 'NONE').toLowerCase().split('_').join('')];

	return (
		<Paper className={cn(styles.listItem, eventPriorityClassName)} elevation={0}>
			<div className={styles.listItemLeft}>
				<EventsV2ListItemPriorityCell value={event.priority || 'NONE'} />
				<div className={styles.listItemLeftNames}>
					{event.name && (
						<Tooltip title={event.name || ''}>
							<span className={cn(styles.name, eventPriorityClassName)}>{event.name}</span>
						</Tooltip>
					)}

					{event.code && <span className={cn(styles.code, eventPriorityClassName)}>{event.code}</span>}
				</div>
			</div>
			<div className={styles.listItemRight}>
				<Tooltip title={event.activeTs && moment(event.activeTs).format('lll')}>
					<span className={cn(styles.date, eventPriorityClassName)}>
						{eventDurationTime && (
							<>
								<span style={{ opacity: 0.6 }}>{t(`events.params.duration_since`)}</span> <span style={{ fontWeight: 600 }}>{eventDurationTime.duration}</span>{' '}
								<span style={{ opacity: 0.6 }}>{t(`events.params.time_range_type.${eventDurationTime.durationType}`)}</span>
							</>
						)}
					</span>
				</Tooltip>
			</div>
		</Paper>
	);
};

export default BuildingVirtualHMIAlarmsListItem;
