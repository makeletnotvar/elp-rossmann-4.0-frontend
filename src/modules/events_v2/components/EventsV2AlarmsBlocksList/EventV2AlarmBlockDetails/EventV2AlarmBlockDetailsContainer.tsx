import { ElpEventV2AlarmBlockIdentifyProps } from 'modules/events_v2/interfaces/eventV2-alarm-block-identify.interface';
import * as React from 'react';
import EventV2AlarmBlockDetails from './EventV2AlarmBlockDetails';
import { useDetailedEventAlarmBlock } from './EventV2AlarmBlockDetailsHooks';

interface EventV2AlarmBlockDetailsContainerProps {
	uuid: string;
	onClose: () => void;
	onDelete: (deleteAlarmBlock: ElpEventV2AlarmBlockIdentifyProps) => void;
}

const EventV2AlarmBlockDetailsContainer: React.FC<EventV2AlarmBlockDetailsContainerProps> = ({ uuid, onClose, onDelete }) => {
	const { alarmBlock } = useDetailedEventAlarmBlock(uuid);

	return alarmBlock && <EventV2AlarmBlockDetails alarmblock={alarmBlock} onClose={onClose} onDelete={onDelete} />;
};

export default EventV2AlarmBlockDetailsContainer;
