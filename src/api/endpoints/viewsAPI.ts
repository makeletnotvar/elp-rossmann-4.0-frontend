import { createUrl } from 'api/helpers';
import queryString from 'query-string';

export const viewsAPI = {
    getView: (uuid: string) => createUrl(`/view/${uuid}`),
    getViews: () => createUrl(`/views/`),
    getBuildingViews: (uuid: string) => createUrl(`/building/${uuid}/views`),
    addView: (buildingUUID: string) => createUrl(`/view/${buildingUUID}`),
    removeView: (uuid: string) => createUrl(`/view/${uuid}`),
    updateView: (uuid: string) => createUrl(`/view/${uuid}`),
    selectBuildingPoints: (buildingUUID: string, q: string) => createUrl(`/view/${buildingUUID}/points?${queryString.stringify({ q })}`)
}

export default viewsAPI;