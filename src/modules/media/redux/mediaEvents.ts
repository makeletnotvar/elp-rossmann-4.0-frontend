import { API } from "api/axios";
import useSelector from "modules/common/helpers/redux/useSelector";
import { Config, createModule } from "vredux";
import { MediaRootState } from './index';
import mediaAPI from 'api/endpoints/mediaAPI';
import eventsApi from "api/endpoints/eventsAPI";

export interface MediaEventsData {
  mediaEvents: ElpEvent[];
  count: number;
  countAll: number;
}

export interface MediaEventsResponse {
  events: ElpEvent[];
  count: number;
  countAll: number;
}

export interface MediaEventAcknowledge {
  user: string;
  ts: number;
}

const config: Config<MediaEventsData> = {
  name: 'mediaEvents',
  initialData: {
    mediaEvents: [],
    count: -1,
    countAll: -1
  },
  actions: {
    'fetch': async (data: any, settings) => {
      const {deviceUUID, routeProps} = settings as {deviceUUID: string; routeProps: any};
      const response = await API.get<MediaEventsResponse>(eventsApi.getDeviceEvents(deviceUUID, routeProps));
      const { events, count, countAll } = response.data;
      return { ...data, mediaEvents: events, count, countAll }
    },
  }
}

// helpers
function mapEventsWithConfirmation(uuid: string, user: string, ts: number) {
  return function (nextCurrentEvent: ElpEvent): ElpEvent {
    const toUpdate = nextCurrentEvent.uuid === uuid;
    return toUpdate
      ? { ...nextCurrentEvent, acknowledged: true, acknowledgeTs: ts, acknowledgeUser: user }
      : nextCurrentEvent;
  }
}

export const { reducer: mediaEventsReducer, actions: mediaEventsActions } = createModule<MediaEventsData>(config);
export const useMediaEventsState = () => useSelector((state: MediaRootState) => state.mediaEvents);