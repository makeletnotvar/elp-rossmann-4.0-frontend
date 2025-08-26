import * as React from 'react';
import EventDetails from './MediaEventDetails';
import { useDetailedMediaEvent } from './MediaEventDetailsHooks';

interface MediaEventDetailsContainerProps {
	uuid: string;
	onClose: () => void;
}

const MediaEventDetailsContainer: React.FC<MediaEventDetailsContainerProps> = ({ uuid, onClose }) => {
	const { mediaEvent } = useDetailedMediaEvent(uuid);

	return mediaEvent && <EventDetails mediaEvent={mediaEvent} onClose={onClose} />;
};

export default MediaEventDetailsContainer;
