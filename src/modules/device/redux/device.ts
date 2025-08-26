import { API } from "api/axios";
import { Config, createModule } from "vredux";
import { DeviceRootState } from "modules/device/redux";
import useSelector from "modules/common/helpers/redux/useSelector";
import { devicesAPI } from "api/endpoints/devicesAPI";

export interface DeviceData {
    device: DetailedDevice | null;
}

export interface DeviceResponse {
    device: Device & DeviceDetails;
}

const config: Config<DeviceData> = {
    name: 'devices',
    initialData: {
        device: null
    },
    actions: {
        'fetch': async (data, {uuid}) => {
            const response = await API.get<DeviceResponse>(devicesAPI.getDevice(uuid));
            return { ...data, device: response.data.device }
        },
        'update': async (data, {device}) => {
            const response = await API.put<DeviceResponse>(devicesAPI.updateDevice(device.uuid), { device });
            return { ...data, device: response.data.device }
        },
        'add': async (data, {device}) => {
            const response = await API.post<DeviceResponse>(devicesAPI.addDevice(), { device });
            return { ...data, device: response.data.device }
        },
        'remove': async (data, {uuid}) => {
            await API.delete<DeviceResponse>(devicesAPI.removeDevice(uuid));
            return data;
        },
    }
}

export const {reducer: deviceReducer, actions: deviceActions} = createModule<DeviceData>(config);
export const useDeviceState = () => useSelector((state: DeviceRootState) => state.device);