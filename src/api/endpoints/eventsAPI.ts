import { createUrl } from 'api/helpers';
import { EventsV2RequestFilters } from 'modules/events_v2/interfaces/eventsV2-filters.interface';
import { EventV2HeatmapsRequestParams } from 'modules/events_v2/redux/heatmaps';
import queryString from 'query-string';

export const eventsApi = {
	getEvents: (options: any) => createUrl(`/events?${queryString.stringify(options)}`),
	getEventsV2: (options: EventsV2RequestFilters) => createUrl(`/events_v2?${queryString.stringify(options)}`),
	confirmEvents: (eventsUUIDS: string[]) => createUrl(`/events/confirm?${queryString.stringify({ e: eventsUUIDS })}`),
	getPointEvents: (uuid: string) => createUrl(`/events/point/${uuid}`),
	getBuildingEvents: (uuid: string) => createUrl(`/events/building/${uuid}`),
	getDeviceEvents: (uuid: string, props?: any) => createUrl(`/events/device/${uuid}?${queryString.stringify(props)}`),
	getEventsCount: (options: object = {}) => createUrl(`/events/summary?${queryString.stringify(options)}`),
	getAlarmsBlocks: (options: any) => createUrl(`/events_v2/blocks?${queryString.stringify(options)}`),
	confirmAlarmBlock: () => createUrl(`/events_v2/blocks`),
	updateAlarmBlock: () => createUrl(`/events_v2/blocks`),
	deleteAlarmBlock: (deviceUUID: string, code: string) => createUrl(`/events_v2/blocks/${deviceUUID}/${code}`),
	getInstance: (eventUUID: string) => createUrl(`/events_v2/instance/${eventUUID}`),
	getHistory: (options: any) => createUrl(`/events_v2/stats/data?${queryString.stringify(options)}`),
	getHeatmaps: (settings: EventV2HeatmapsRequestParams) => createUrl(`/events_v2/data?${queryString.stringify(settings)}`),
	getUnitXidsList: (buildingUUID: string) => createUrl(`/units/list/${buildingUUID}`),
};

export default eventsApi;
