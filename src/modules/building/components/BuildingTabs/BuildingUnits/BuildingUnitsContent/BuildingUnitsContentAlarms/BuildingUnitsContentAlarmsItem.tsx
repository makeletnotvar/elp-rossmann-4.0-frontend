import { Paper, Tooltip } from '@mui/material';
import cn from 'classnames';
import EventsV2ListItemPriorityCell from 'modules/events_v2/components/EventsV2List/EventsV2ListItem/EventsV2ListItemPriorityCell';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import useEventV2DurationTime from 'modules/events_v2/hooks/useEventV2DurationTime';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../BuildingUnitsContent.module.scss';

interface BuildingUnitsContentAlarmsItemProps {
	event: BuildingEvent;
}

const BuildingUnitsContentAlarmsItem: React.FC<BuildingUnitsContentAlarmsItemProps> = ({ event }) => {
	const { t } = useTranslation();
	const eventDurationTime = useEventV2DurationTime(event.activeTs, moment(moment.now()).valueOf());
	const eventPriorityClassName =
		styles[
			getEventsPriorityName(event.priority || 0)
				.toLowerCase()
				.split('_')
				.join('')
		];

	return (
		<Paper className={cn(styles.listItem, eventPriorityClassName)} elevation={0}>
			<div className={styles.listItemLeft}>
				<EventsV2ListItemPriorityCell disabledLink value={getEventsPriorityName(event.priority || 0)} />
				<div className={styles.listItemLeftNames}>
					{event.name && (
						<Tooltip title={event.name}>
							<span className={cn(styles.name, eventPriorityClassName)}>{event.name}</span>
						</Tooltip>
					)}
					{event.code && <span className={cn(styles.code, eventPriorityClassName)}>{event.code?.toLocaleLowerCase()}</span>}
				</div>
			</div>
			<div className={styles.listItemRight}>
				<Tooltip title={0 && moment(event.activeTs).format('lll')}>
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

export default BuildingUnitsContentAlarmsItem;
