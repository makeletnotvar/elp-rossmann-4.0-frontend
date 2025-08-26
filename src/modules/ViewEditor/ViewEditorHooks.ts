
function getFilteredPropertiesValues(filterPreffix: string, ob: any): string[] {
    const pointsUUIDs: any[] = Object.entries(ob)
        .filter(([key, value]) => (key as string).startsWith(filterPreffix))
        .map(([key, value]) => value)

    return pointsUUIDs;
}

function getViewItemsXidFilterPoints(view: DrawView, building: Building | null): string[] {
    if (view.config && view.config.items && building) {
        const xidPointsRefs = (building.pointsXidsRefs || {});
        const arr = view.config.items
            .filter(item => item.xidPreffixFilter && item.xidPreffixFilter.split('').length > 3)
            .map(item => item.xidPreffixFilter)
            .reduce((merged, nextXidPreffixFilter) => [...merged, ...getFilteredPropertiesValues(nextXidPreffixFilter, xidPointsRefs)], [])

        return arr;
    }

    return [];
}

/**
 * @TODO!!! 
 * Oldest optimized methods was getting only points related to view items (by points references).
 * 
 * Current temporary method, after add script item is not efficient! It's getting all view related building points.
 * It should be rewrited or change whole loading related points solutions.
 * 
 * Maybe iterate throught all points, get xid and find it in all script items content (by text search) or xidRefItems (?)
 * Problem is the xid in script content could be definied on several ways, like:
 *  - using params
 *  - directly in script
 *  - using text concatentation
 * 
 * @param view 
 * @param building 
 * @returns 
 */
export function getViewPoints(view: DrawView, building: Building | null): string[] {
    const points = building ? Object.values(building.pointsXidsRefs || {}) : [];
    // if (view.config && view.config.items) {
    //     const xidRefsFilterPoints = getViewItemsXidFilterPoints(view, building);

    //     const arr = view.config.items
    //         .filter(item => item.pointRef)
    //         .map(item => item.pointRef.uuid)

    //     // Ignore duplicates
    //     const noDuplicatesArray = Array.from(new Set([...arr, ...xidRefsFilterPoints]));

    //     return noDuplicatesArray;
    // } else {
    //     return [];
    // }
    return points;
}

const VIEW_INITIAL_WIDTH = 1000;
const VIEW_INITIAL_HEIGHT = 500;

export function createNewView(buildingUUID: string): DrawView {

    return {
        uuid: 'new',
        name: 'new view',
        type: 'draw',
        building: {
            uuid: buildingUUID,
            name: buildingUUID
        },
        config: {
            items: [],
            width: VIEW_INITIAL_WIDTH,
            height: VIEW_INITIAL_HEIGHT,
            zoom: 1
        },
    }
}