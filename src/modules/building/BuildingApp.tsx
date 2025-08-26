// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import BuildingContainer from 'modules/building/containers/BuildingContainer';
import { getBuildingModule } from 'modules/building/redux';
import { getAlarmsBlocksModule, getEventsV2Module, getEventV2HeatmapsModule, getEventV2HistoryModule, getEventV2InstanceModule } from 'modules/events_v2/redux';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';

const BuildingApp: React.FC = () => {
	return (
		<>
			<DynamicModuleLoader
				modules={[
					getBuildingModule(),
					getEventsV2Module(),
					getAlarmsBlocksModule(),
					getEventV2InstanceModule(),
					getEventV2HistoryModule(),
					getEventV2HeatmapsModule(),
				]}
			>
				<BuildingContainer />
			</DynamicModuleLoader>
		</>
	);
};

export default BuildingApp;
