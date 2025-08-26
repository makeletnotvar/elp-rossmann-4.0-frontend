import { API } from 'api/axios';
import { devicesAPI } from 'api/endpoints/devicesAPI';
import { DevicesRootState } from 'modules/devices/redux';
import { Config, createModule } from 'vredux';
import useSelector from '../../common/helpers/redux/useSelector';

export interface DevicesData {
    devices: Device[];
    count: number;
    countAll: number;
}
export interface DevicesResponse {
    devices: Device[];
    count: number;
    countAll: number;
}
interface DeviceResponse {
    device: Device;
    count: number;
    countAll: number;
}

const config: Config<DevicesData> = {
    name: 'devices',
    initialData: {
        devices: [],
        count: -1,
        countAll: -1
    },
    actions: {
        'fetch': async (data, settings) => {
            const response = await API.get<DevicesResponse>(devicesAPI.getDevices(settings));
            const nextState = { ...response.data };
            return nextState;
        },
        'add': async (data, device) => {
            const response = await API.post<DeviceResponse>(devicesAPI.addDevice(), { device });
            const nextState = { ...data, devices: [...data.devices, response.data.device] };
            return nextState;
        },
        'remove': async (data, {uuid}) => {
            await API.delete<{}>(devicesAPI.removeDevice(uuid));
            return data;
        },
    }
}

export const {reducer: devicesReducer, actions: devicesActions} = createModule<DevicesData>(config);
export const useDevicesState = () => useSelector((state: DevicesRootState) => state.devices);