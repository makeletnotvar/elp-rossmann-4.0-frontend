import { createUrl } from 'api/helpers';
import queryString from 'query-string';

const buildingsAPI = {
	getBuildings: (settings: any) => createUrl(`/buildings/?${queryString.stringify(settings)}`),
	getBuildingsFiltersPoints: () => createUrl(`/buildings/filter-points`),
	getBuilding: (uuid: string) => createUrl(`/building/${uuid}`),
	addBuilding: () => createUrl(`/building/`),
	updateBuilding: (uuid: string) => createUrl(`/building/${uuid}`),
	removeBuilding: (uuid: string) => createUrl(`/building/${uuid}`),
	getBuildingPoints: (uuid: string) => createUrl(`/building/${uuid}/points`),
	getBuildingsList: (q: string, companyUUID?: string) => createUrl(`/buildings/list?${queryString.stringify({ q, c: companyUUID })}`),
	getBuildingsListV2: (q: string, companyUUID?: string) => createUrl(`/buildings/list_v2?${queryString.stringify({ q, c: companyUUID })}`),
	getBuildingsToFillList: (uuid: string | string[]) => createUrl(`/buildings/refs?${queryString.stringify({ uuid })}`),
	getBuildingSettablePoints: (uuid: string, q: string) => createUrl(`/building/${uuid}/settable-points`),
	getBuildingAsCode: (code: string) => createUrl(`/buildings/as-code/${code}`),
	getBuildingsByAdmin: (uuid: string) => createUrl(`/buildings/by-admin/${uuid}`),
};

export default buildingsAPI;
