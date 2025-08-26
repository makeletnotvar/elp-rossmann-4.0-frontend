import buildingsReducer, { BuildingsState } from 'modules/buildings/redux/buildings';
import pointsReducer, { PointsState } from 'modules/common/redux/points';
import pollReducer, { PollState } from 'modules/common/redux/poll';
import { IModule } from 'redux-dynamic-modules';
import buildingsFiltersReducer, { BuildingsFiltersState } from './buildingsFilters';

export interface BuildingsRootState {
	buildings: BuildingsState;
	buildingsFilters: BuildingsFiltersState;
	poll: PollState;
	points: PointsState;
}

export const getBuildingsModule = (): IModule<BuildingsRootState> => ({
	id: 'buildings',
	reducerMap: {
		buildings: buildingsReducer,
		buildingsFilters: buildingsFiltersReducer,
		poll: pollReducer,
		points: pointsReducer,
	},
	initialActions: [{ type: 'INIT_BUILDINGS_MODULE' }],
});
