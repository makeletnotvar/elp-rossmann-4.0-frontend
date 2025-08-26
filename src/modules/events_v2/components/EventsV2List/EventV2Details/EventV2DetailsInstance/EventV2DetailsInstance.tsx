import Loader from 'modules/common/components/Loaders/Loader';
import { useEventV2InstanceRequest } from 'modules/events_v2/hooks/useEventV2InstanceRequest';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import React from 'react';
import EventV2DetailsInstanceView from './EventV2DetailsInstanceView';

interface EventV2DetailsInstanceProps {
	event: ElpEventV2;
	params: {
		eventUUID: string | null;
		alarmCode: string | null;
		deviceUUID: string | null;
	};
	tab: 'active' | 'history';
}

const EventV2DetailsInstance: React.FC<EventV2DetailsInstanceProps> = ({ params, tab }) => {
	const { eventInstance, statusEventInstance } = useEventV2InstanceRequest(params.eventUUID);

	return statusEventInstance.isFetching ? (
		<Loader />
	) : (
		eventInstance && statusEventInstance.isSuccess && <EventV2DetailsInstanceView tab={tab} event={eventInstance} />
	);
};

export default EventV2DetailsInstance;
