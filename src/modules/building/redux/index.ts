import buildingReducer, { BuildingState } from 'modules/building/redux/building';
import buildingsReducer, { BuildingsState } from 'modules/buildings/redux/buildings';
import pollReducer, { PollState } from 'modules/common/redux/poll';
import viewReducer, { ViewState } from 'modules/common/redux/view';
import viewsReducer, { ViewsRootState } from 'modules/common/redux/views';
import { ConsumptionDataData, consumptionReducer } from 'modules/consumption/redux/consumption';
import { ChartDataData, chartDataReducer } from 'modules/data/redux/chartData';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';
import pointsReducer, { PointsState } from '../../common/redux/points';
import buildingUnitsReducer, { BuildingUnitsState } from './buildingUnits';

export interface BuildingRootState {
	building: BuildingState;
	buildings: BuildingsState;
	buildingUnits: BuildingUnitsState;
	poll: PollState;
	points: PointsState;
	views: ViewsRootState;
	view: ViewState;
	consumption: ExtendedState<ConsumptionDataData>;
	chartData: ExtendedState<ChartDataData>;
}

export const getBuildingModule = (): IModule<BuildingRootState> => ({
	id: 'building',
	reducerMap: {
		building: buildingReducer,
		buildingUnits: buildingUnitsReducer,
		poll: pollReducer,
		points: pointsReducer,
		view: viewReducer,
		views: viewsReducer,
		buildings: buildingsReducer,
		consumption: consumptionReducer,
		chartData: chartDataReducer,
	},
	initialActions: [{ type: 'INIT_BUILDINGS_MODULE' }],
});
