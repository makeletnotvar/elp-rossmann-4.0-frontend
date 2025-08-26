import mapDataReducer, { MapDataState } from 'modules/map/redux/map';
import { IModule } from 'redux-dynamic-modules';
import mapGroupDataReducer, { MapGroupDataState } from './mapGroup';
import mapPinDataReducer, { MapPinDataState } from './mapPin';

export interface MapRootState {
	map: MapDataState;
	pinDetails: MapPinDataState;
	groupDetails: MapGroupDataState;
}

export const getMapModule = (): IModule<MapRootState> => ({
	id: 'map',
	reducerMap: {
		map: mapDataReducer,
		pinDetails: mapPinDataReducer,
		groupDetails: mapGroupDataReducer,
	},
	initialActions: [{ type: 'INIT_MAP_MODULE' }],
});
