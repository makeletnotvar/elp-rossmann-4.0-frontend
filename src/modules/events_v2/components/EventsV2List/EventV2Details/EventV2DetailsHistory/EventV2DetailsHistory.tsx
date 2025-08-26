import Loader from 'modules/common/components/Loaders/Loader';
import { useEventV2HistoryRequest } from 'modules/events_v2/hooks/useEventV2HistoryRequest';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import React from 'react';
import EventV2DetailsHistoryView from './EventV2DetailsHistoryView';

interface EventV2DetailsHistoryProps {
	event: ElpEventV2;
	params: {
		eventUUID: string | null;
		alarmCode: string | null;
		deviceUUID: string | null;
	};
}

const EventV2DetailsHistory: React.FC<EventV2DetailsHistoryProps> = ({ params }) => {
	const { eventHistory, statusEventHistory } = useEventV2HistoryRequest(params);

	return statusEventHistory.isFetching ? <Loader /> : eventHistory && statusEventHistory.isSuccess && <EventV2DetailsHistoryView event={eventHistory} />;
};

export default EventV2DetailsHistory;
