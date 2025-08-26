import { createUrl } from 'api/helpers';
import { TriggerMapDataProps } from 'modules/map/hooks/useMapData';
import queryString from 'query-string';

const mapAPI = {
	getMapData: (settings: TriggerMapDataProps) => createUrl(`/maps/data?${queryString.stringify(settings)}`),
	getMapPinData: (uuid: string) => createUrl(`/maps/details/${uuid}`),
	getMapGroupData: (id: string) => createUrl(`/maps/data/group?${queryString.stringify({ id })}`),
};

export default mapAPI;
