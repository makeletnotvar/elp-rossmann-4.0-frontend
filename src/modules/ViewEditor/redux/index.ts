import buildingReducer, { BuildingState } from 'modules/building/redux/building';
import buildingUnitsReducer, { BuildingUnitsState } from 'modules/building/redux/buildingUnits';
import appReducer, { AppState } from 'modules/common/redux/app';
import viewReducer, { ViewState } from 'modules/common/redux/view';
import viewsReducer, { ViewsRootState } from 'modules/common/redux/views';
import filesReducer, { FilesState } from 'modules/files/redux/files';
import { IModule } from 'redux-dynamic-modules';
import { pointsReducer, PointsState } from '../../common/redux/points';
import pollReducer, { PollState } from '../../common/redux/poll';

export const viewsReducers: ViewEditorRootState = {
	points: pointsReducer as any,
	poll: pollReducer as any,
	view: viewReducer as any,
	views: viewsReducer as any,
	building: buildingReducer as any,
	buildingUnits: buildingUnitsReducer as any,
	files: filesReducer as any,
	app: appReducer as any,
};

export interface ViewEditorRootState {
	points: PointsState;
	poll: PollState;
	view: ViewState;
	views: ViewsRootState;
	building: BuildingState;
	buildingUnits: BuildingUnitsState;
	files: FilesState;
	app: AppState;
}

export const getViewEditorModule = (): IModule<ViewEditorRootState> => ({
	id: 'view_editor',
	reducerMap: {
		points: pointsReducer,
		poll: pollReducer,
		view: viewReducer,
		views: viewsReducer,
		building: buildingReducer,
		buildingUnits: buildingUnitsReducer,
		files: filesReducer,
		app: appReducer,
	},
	initialActions: [{ type: 'INIT_VIEW_MODULE' }],
});
