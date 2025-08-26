import pointsReducer, { PointsState } from 'modules/common/redux/points';
import pollReducer, { PollState } from 'modules/common/redux/poll';
import { DeviceData, deviceReducer } from 'modules/device/redux/device';
import mediaDeviceConsumptionDataReducer, { MediaDeviceConsumptionDataState } from 'modules/media/redux/mediaConsumptionData';
import mediaDeviceDataReducer, { MediaDeviceDataState } from 'modules/media/redux/mediaData';
import mediaDevicesReducer, { MediaDevicesState } from 'modules/media/redux/mediaDevices';
import { MediaEventsData, mediaEventsReducer } from 'modules/media/redux/mediaEvents';
import { IModule } from 'redux-dynamic-modules';
import { ExtendedState } from 'vredux';

export interface MediaRootState {
  mediaDevices: MediaDevicesState
  consumptionData: MediaDeviceConsumptionDataState
  data: MediaDeviceDataState
  poll: PollState
  device: ExtendedState<DeviceData>
  points: PointsState
  mediaEvents: ExtendedState<MediaEventsData>
}

export const getMediaModule = (): IModule<MediaRootState> => ({
  id: "media",
  reducerMap: {
    mediaDevices: mediaDevicesReducer,
    consumptionData: mediaDeviceConsumptionDataReducer,
    data: mediaDeviceDataReducer,
    poll: pollReducer,
    device: deviceReducer,
    points: pointsReducer,
    mediaEvents: mediaEventsReducer
  },
  initialActions: [
    { type: 'INIT_MEDIA_MODULE' }
  ],
});