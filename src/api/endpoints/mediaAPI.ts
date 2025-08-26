import { createUrl } from "api/helpers";
import queryString from 'query-string';

const mediaAPI = {
  getDevices: (settings: any) => createUrl(`/media/list?${queryString.stringify(settings)}`),
  getDevicePointData: (settings: MediaParamsRequestSettings) => createUrl(`/media/data?${queryString.stringify(settings)}`),
  getDevicePointConsumptionsData: (settings: MediaConsumptionsRequestSettings) => createUrl(`/media/consumption-data?${queryString.stringify(settings)}`),
};

export default mediaAPI;