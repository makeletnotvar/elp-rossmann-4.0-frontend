import { EventsData, eventsReducer } from 'modules/events/redux/events';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';
import { pointsReducer, PointsState } from '../../common/redux/points';
import pollReducer, { PollState } from '../../common/redux/poll';

export const eventsReducers: EventsRootState = {
	points: pointsReducer as any,
	poll: pollReducer as any,
	events: eventsReducer as any,
};

export interface EventsRootState {
	points: PointsState;
	poll: PollState;
	events: ExtendedState<EventsData>;
}

export const getEventsModule = (): IModule<EventsRootState> => ({
	id: 'events',
	reducerMap: {
		points: pointsReducer,
		poll: pollReducer,
		events: eventsReducer,
	},
	initialActions: [{ type: 'INIT_EVENTS_MODULE' }],
});
