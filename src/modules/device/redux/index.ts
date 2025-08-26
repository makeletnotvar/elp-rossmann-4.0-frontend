import buildingsFiltersReducer, { BuildingsFiltersState } from 'modules/buildings/redux/buildingsFilters';
import pointsReducer, { PointsState } from 'modules/common/redux/points';
import { DeviceData, deviceReducer } from 'modules/device/redux/device';
import devicePointsReducer, { DevicePointsState } from 'modules/device/redux/devicePoints';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';

export interface DeviceRootState {
	points: PointsState;
	devicePoints: DevicePointsState;
	device: ExtendedState<DeviceData>;
	buildingsFilters: BuildingsFiltersState;
}

export const getDeviceModule = (): IModule<DeviceRootState> => ({
	id: 'device',
	reducerMap: {
		points: pointsReducer,
		devicePoints: devicePointsReducer,
		device: deviceReducer,
		buildingsFilters: buildingsFiltersReducer,
	},
	initialActions: [{ type: 'INIT_DEVICE_MODULE' }],
});
