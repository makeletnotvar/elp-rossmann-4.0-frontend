import { API } from "api/axios";
import eventsAPI from "api/endpoints/eventsAPI";
import useSelector from "modules/common/helpers/redux/useSelector";
import { Config, createModule } from "vredux";
import { EventsRootState } from './index';

export interface EventsData {
    events: ElpEvent[];
    count: number;
    countAll: number;
}

export interface EventsResponse {
    events: ElpEvent[];
    count: number;
    countAll: number;
}

export interface EventAcknowledge {
    user: string;
    ts: number;
}

const config: Config<EventsData> = {
    name: 'events',
    initialData: {
        events: [],
        count: -1,
        countAll: -1
    },
    actions: {
        'fetch': async (data, settings) => {
            const response = await API.get<EventsResponse>(eventsAPI.getEvents(settings));
            const {events, count, countAll} = response.data;
            return { ...data, events, count, countAll }
        },
        'acknowledge': async (data, uuid) => {
            const response = await API.put<EventAcknowledge>(eventsAPI.confirmEvents([uuid]));
            const {user, ts} = response.data;
            return { ...data,
                events: data.events.map(mapEventsWithConfirmation(uuid, user, ts))
            }
        },
    }
}

// helpers
function mapEventsWithConfirmation(uuid: string, user: string, ts: number){
    return function(nextCurrentEvent: ElpEvent): ElpEvent {
        const toUpdate = nextCurrentEvent.uuid === uuid;
        return toUpdate
            ? {...nextCurrentEvent, acknowledged: true, acknowledgeTs: ts, acknowledgeUser: user}
            : nextCurrentEvent;
    }
}

export const {reducer: eventsReducer, actions: eventsActions} = createModule<EventsData>(config);
export const useEventsState = () => useSelector((state: EventsRootState) => state.events);