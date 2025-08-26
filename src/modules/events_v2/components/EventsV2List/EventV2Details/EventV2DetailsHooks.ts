import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import { useEventsV2State } from 'modules/events_v2/redux/eventsV2';

export function useDetailedEvent(uuid: string): { event: ElpEventV2 | null } {
	const {
		data: { events },
	} = useEventsV2State();
	return {
		event: events.find(e => e.uuid === uuid) || null,
	};
}
