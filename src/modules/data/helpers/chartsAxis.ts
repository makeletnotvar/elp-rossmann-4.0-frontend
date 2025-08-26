type ChartYAxises = {
    yAxises: Map<string, Point>,
    pointsOfYAxises: Map<string | number, number | string>
};

export function getMergedYAxises(points: Point[]): ChartYAxises {
    const yAxises = new Map<string, Point>();
    const pointsOfYAxises = new Map<string | number, string | number>();

    points.map(
        (point, pointIndex) => {
            if (point.type === 'numeric') {
                const render = point.customRender as NumericRender;
                const mergeIdentifier = render.suffix || String(pointIndex);
                yAxises.set(mergeIdentifier, point);
                pointsOfYAxises.set(point.uuid || '', mergeIdentifier);
            } else {
                /**
                 * ENUM states
                 * Temporary solution is separate y-axis for each enum chart
                 */
                yAxises.set(String(pointIndex), point);
                pointsOfYAxises.set(point.uuid || '', String(pointIndex));
            }
        }
    )

    return {
        yAxises,
        pointsOfYAxises
    };
}