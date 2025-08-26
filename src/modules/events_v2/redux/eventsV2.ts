import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { Config, createModule } from 'vredux';
import { ElpEventV2AlarmBlock } from '../interfaces/eventV2-alarm-block.interface';
import { ElpEventV2 } from '../interfaces/eventV2.interface';
import { EventsV2RootState } from './index';

export interface EventsV2Data {
	events: ElpEventV2[];
	count: number;
	countAll: number;
}

export interface EventsV2Response {
	events: ElpEventV2[];
	count: number;
	countAll: number;
}

export interface EventV2Acknowledge {
	user: string;
	ts: number;
}

const config: Config<EventsV2Data> = {
	name: 'events',
	initialData: {
		events: [],
		count: -1,
		countAll: -1,
	},
	actions: {
		fetch: async (data, settings) => {
			const response = await API.get<EventsV2Response>(eventsApi.getEventsV2(settings));
			if (response.status === 200) {
				const { events, count, countAll } = response.data;
				return { ...data, events, count, countAll };
			} else {
				return { ...data };
			}
		},
		acknowledge: async (data, uuid) => {
			const response = await API.put<EventV2Acknowledge>(eventsApi.confirmEvents([uuid]));
			if (response.status === 200) {
				const { user, ts } = response.data;
				return {
					...data,
					events: data.events.map(mapEventsWithConfirmation(uuid, user, ts)),
				};
			} else {
				return { ...data };
			}
		},
		confirm: async (data, blockData: ElpEventV2AlarmBlock) => {
			const response = await API.post<{ alarmBlock: ElpEventV2AlarmBlock }>(eventsApi.confirmAlarmBlock(), { alarmBlock: blockData });
			if (response.status === 201) {
				return { ...data, events: data.events.filter(event => event.code !== response.data.alarmBlock.code) };
			} else {
				return { ...data };
			}
		},
	},
};

function mapEventsWithConfirmation(uuid: string, user: string, ts: number) {
	return function (nextCurrentEvent: ElpEventV2): ElpEventV2 {
		const toUpdate = nextCurrentEvent.uuid === uuid;
		return toUpdate ? { ...nextCurrentEvent, acknowledged: true, acknowledgeTs: ts, acknowledgeUser: user } : nextCurrentEvent;
	};
}

export const { reducer: eventsV2Reducer, actions: eventsV2Actions } = createModule<EventsV2Data>(config);
export const useEventsV2State = () => useSelector((state: EventsV2RootState) => state.events);
