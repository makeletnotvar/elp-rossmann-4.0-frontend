import React from 'react';
import EventConfirm from './EventV2Confirm';
import { useConfirmedEvent } from './EventV2ConfirmHooks';

interface EventV2ConfirmContainerProps {
	uuid: string;
	onClose: () => void;
	buildingUUID?: string;
}

const EventV2ConfirmContainer: React.FC<EventV2ConfirmContainerProps> = ({ uuid, onClose, buildingUUID }) => {
	const { event } = useConfirmedEvent(uuid);

	return event && <EventConfirm buildingUUID={buildingUUID} event={event} onClose={onClose} />;
};

export default EventV2ConfirmContainer;
