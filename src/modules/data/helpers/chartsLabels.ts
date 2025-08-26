
/**
 * 
 * Get point chart name
 * 
 */
export function getChartPointName(point: Point): string {
    const buildingName = point.building ? point.building.name : null;
    const deviceName = point.device ? point.device.name : null;
    const pointName = point.name || point.registerName;

    if (buildingName) {
        return `${buildingName} - ${pointName}`;
    } else if (deviceName) {
        return `${deviceName} - ${pointName}`;
    } else {
        return pointName || 'unnamed-point';
    }
}

/**
 * 
 * Get point unit
 * 
 */
export function getPointUnit(point: Point): string | undefined {
    if (point && point.type === 'numeric') {
        const render = point.customRender as NumericRender;
        if (render) {
            return render.suffix || undefined;
        }
    }
}


/***
 * 
 * Generate points common chart name
 * i.e. 'point A + point B + point C'
 * 
 */
export function getPointsChartName(points: Point[]) {
    const MAX_LENGTH = 50
    return points
        .map(getChartPointName)
        .join(' + ')
        .slice(0, MAX_LENGTH);
}
