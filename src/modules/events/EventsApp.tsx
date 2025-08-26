// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import EventsLayout from './components/EventsLayout/EventsLayout';
import { getEventsModule } from './redux/index';

const EventsApp: React.FC = () => {
	return (
		<DynamicModuleLoader modules={[getEventsModule()]}>
			<EventsLayout />
		</DynamicModuleLoader>
	);
};

export default EventsApp;
