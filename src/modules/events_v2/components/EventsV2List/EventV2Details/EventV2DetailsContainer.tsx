import React from 'react';
import EventDetails from './EventV2Details';
import { useDetailedEvent } from './EventV2DetailsHooks';

interface EventV2DetailsContainerProps {
	uuid: string;
	onClose: () => void;
	tab: 'active' | 'history';
}

const EventV2DetailsContainer: React.FC<EventV2DetailsContainerProps> = ({ uuid, onClose, tab }) => {
	const { event } = useDetailedEvent(uuid!);

	return (
		event && (
			<EventDetails tab={tab} params={{ alarmCode: event.code, deviceUUID: event.device?.uuid || '', eventUUID: event.uuid }} event={event} onClose={onClose} />
		)
	);
};

export default EventV2DetailsContainer;
