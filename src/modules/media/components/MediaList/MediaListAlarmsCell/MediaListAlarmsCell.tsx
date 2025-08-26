import EventsV2ListItemPriorityCell from 'modules/events_v2/components/EventsV2List/EventsV2ListItem/EventsV2ListItemPriorityCell';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface MediaListAlarmsCellProps {
	count: number;
	maxPriority: EventPriority;
	deviceUUID: string;
}

const MediaListAlarmsCell: React.FC<MediaListAlarmsCellProps> = ({ count, maxPriority, deviceUUID }) => {
	const { t } = useTranslation();

	const label = count.toString();
	const translatedMaxPriority = t(`events.params.priority_values.${maxPriority}`);
	const title = t(`events.messages.events_count_details`, { count, maxPriority: translatedMaxPriority });

	return (
		<Link to={`/media/${deviceUUID}/events`} style={{ textDecoration: 'none' }}>
			<EventsV2ListItemPriorityCell value={maxPriority} label={label} title={title} count={count} />
		</Link>
	);
};

export default MediaListAlarmsCell;
