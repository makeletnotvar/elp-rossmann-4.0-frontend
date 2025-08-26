import * as React from 'react';
import EventDetails from './EventDetails';
import { useDetailedEvent } from './EventDetailsHooks';

interface EventDetailsContainerProps {
	uuid: string;
	onClose: () => void;
}

const EventDetailsContainer: React.FC<EventDetailsContainerProps> = ({ uuid, onClose }) => {
	const { event } = useDetailedEvent(uuid);

	return event && <EventDetails event={event} onClose={onClose} />;
};

export default EventDetailsContainer;
