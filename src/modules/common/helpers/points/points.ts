export const ENUM = 'enum';
export const NUMERIC = 'numeric';

export function isEnumPoint(point: Point) {
    return point.type === ENUM;
}

export function isNumericPoint(point: Point){
    return point.type === NUMERIC;
}

export function mapBuildingPointsXidsToUuids(building: Building, xids: string[]): string[]{
    const refs: PointsXidsRefs = building.pointsXidsRefs || {};

    return xids
        .map(xid => refs[xid])
        .filter(uuid => uuid !== undefined);
}