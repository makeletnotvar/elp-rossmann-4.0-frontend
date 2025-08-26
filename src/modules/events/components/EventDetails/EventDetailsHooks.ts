import { useEventsState } from '../../redux/events';

export function useDetailedEvent(uuid: string): { event: ElpEvent | null } {
    const { data: { events } } = useEventsState();
    return {
        event: events.find(e => e.uuid === uuid) || null
    }
}