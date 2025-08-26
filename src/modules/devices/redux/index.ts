import { devicesReducer, DevicesData } from 'modules/devices/redux/devices';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';

export interface DevicesRootState {
    devices: ExtendedState<DevicesData>;
}

export const getDevicesModule = (): IModule<DevicesRootState> => ({
    id: "devices",
    reducerMap: {
        devices: devicesReducer,
    },
    initialActions: [
        { type: 'INIT_DEVICES_MODULE' }
    ],
});