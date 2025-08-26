import { AlarmsBlocksData, alarmsBlocksReducer } from 'modules/events_v2/redux/alarmsBlocks';
import { EventsV2Data, eventsV2Reducer } from 'modules/events_v2/redux/eventsV2';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';
import { pointsReducer, PointsState } from '../../common/redux/points';
import pollReducer, { PollState } from '../../common/redux/poll';
import eventV2HeatmapsReducer, { EventV2HeatmapsState } from './heatmaps';
import eventV2HistoryReducer, { EventV2HistoryState } from './history';
import eventV2InstanceReducer, { EventV2InstanceState } from './instance';

export const eventsV2Reducers: EventsV2RootState = {
	points: pointsReducer as any,
	poll: pollReducer as any,
	events: eventsV2Reducer as any,
};

export interface EventsV2RootState {
	points: PointsState;
	poll: PollState;
	events: ExtendedState<EventsV2Data>;
}

export const getEventsV2Module = (): IModule<EventsV2RootState> => ({
	id: 'eventsV2',
	reducerMap: {
		points: pointsReducer,
		poll: pollReducer,
		events: eventsV2Reducer,
	},
	initialActions: [{ type: 'INIT_EVENTS_V2_MODULE' }],
});

export const alarmBlocksReducers: AlarmsBlocksRootState = {
	alarmsBlocks: alarmsBlocksReducer as any,
};

export interface AlarmsBlocksRootState {
	alarmsBlocks: ExtendedState<AlarmsBlocksData>;
}

export const getAlarmsBlocksModule = (): IModule<AlarmsBlocksRootState> => ({
	id: 'alarmBlocks',
	reducerMap: {
		alarmsBlocks: alarmsBlocksReducer,
	},
	initialActions: [{ type: 'INIT_ALARMSBLOCKS_MODULE' }],
});

export interface EventV2InstanceRootState {
	eventInstance: EventV2InstanceState;
}

export const getEventV2InstanceModule = (): IModule<EventV2InstanceRootState> => ({
	id: 'eventV2Instance',
	reducerMap: {
		eventInstance: eventV2InstanceReducer,
	},
	initialActions: [{ type: 'INIT_EVENT_V2_INSTANCE_MODULE' }],
});

export interface EventV2HistoryRootState {
	eventStats: EventV2HistoryState;
}

export const getEventV2HistoryModule = (): IModule<EventV2HistoryRootState> => ({
	id: 'eventV2History',
	reducerMap: {
		eventStats: eventV2HistoryReducer,
	},
	initialActions: [{ type: 'INIT_EVENT_V2_HISTORY_MODULE' }],
});

export const eventHeatmapsReducers: EventV2HeatmapsRootState = {
	data: eventV2HeatmapsReducer as any,
};

export interface EventV2HeatmapsRootState {
	data: EventV2HeatmapsState;
}

export const getEventV2HeatmapsModule = (): IModule<EventV2HeatmapsRootState> => ({
	id: 'eventV2Heatmaps',
	reducerMap: {
		data: eventV2HeatmapsReducer,
	},
	initialActions: [{ type: 'INIT_EVENT_V2_HEATMAPS_MODULE' }],
});
