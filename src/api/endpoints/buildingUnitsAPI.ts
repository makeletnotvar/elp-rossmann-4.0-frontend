import { createUrl } from 'api/helpers';

export const buildingUnitsAPI = {
	getBuildingUnits: (uuid: string) => createUrl(`/units/${uuid}`),
	addBuildingUnit: (uuid: string) => createUrl(`/units/${uuid}`),
	updateBuildingUnit: (uuid: string, unitXid: string) => createUrl(`/units/${uuid}/${unitXid}`),
	removeBuildingUnit: (uuid: string, xid: string) => createUrl(`/units/${uuid}/${xid}`),
};
