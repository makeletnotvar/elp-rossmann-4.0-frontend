import { useMediaEventsState } from 'modules/media/redux/mediaEvents';

export function useDetailedMediaEvent(uuid: string): { mediaEvent: ElpEvent | null } {
    const { data: { mediaEvents } } = useMediaEventsState();
    return {
        mediaEvent: mediaEvents.find(e => e.uuid === uuid) || null
    }
}