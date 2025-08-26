import build from "@date-io/moment";

/**
 * Global building name function based on building code and city.
 * Name pattern: `[code] city`.
 */
export function getBuildingName(building: Building | undefined | null): string {
    const EMPTY_BUILDING_NAME = '';

    return building
        ? `[${building.code}] ${building.city}`
        : EMPTY_BUILDING_NAME;
}


export function getBuildingConnection(building: Building | undefined): boolean {
    return Boolean(building && building.connection);
}

/**
 * Check if points exists in buildings points refs
 * 
 * @param building 
 * @param xid 
 */
export function checkBuildingPointExists (building: Building, xid: string): boolean {
    const {pointsXidsRefs} = building;
    const exists = Boolean(pointsXidsRefs && pointsXidsRefs.hasOwnProperty(xid));
    return exists;
}