import { createUrl } from "api/helpers";
import queryString from "query-string";

export const devicesAPI = {
  getDevice: (uuid: string) => createUrl(`/device/${uuid}`),
  getDevices: (settings: any) => createUrl(`/devices?${queryString.stringify(settings)}`),
  addDevice: () => createUrl(`/device`),
  updateDevice: (uuid: string) => createUrl(`/device/${uuid}`),
  removeDevice: (uuid: string) => createUrl(`/device/${uuid}`),
  testDevice: (code: string) => createUrl(`/device/test/${code}`),
  reloadDevice: (uuid: string) => createUrl(`/device/${uuid}/reload`),
  getPoints: () => createUrl(`/points`),
  getDeviceRegisters: (uuid: string) => createUrl(`/device/${uuid}/registers`),
  addDevicePoints: (uuid: string) => createUrl(`/device/${uuid}/points`),
  removePoint: (pointUUID: string) => createUrl(`/point/${pointUUID}`),
  updatePoint: (pointUUID: string) => createUrl(`/point/${pointUUID}`),
  connectVirtualHMI: () => createUrl(`/vhmi/connect`),
};

export default devicesAPI;
