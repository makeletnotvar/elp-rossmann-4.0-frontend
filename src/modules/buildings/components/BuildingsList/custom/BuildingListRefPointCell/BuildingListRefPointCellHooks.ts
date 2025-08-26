import { usePointValue } from '../../../../../common/redux/poll';
import { renderPointValue } from '../../../../../common/helpers/points/renderers';
import { usePoint, usePoints } from 'modules/common/redux/points';
import { NUMERIC } from 'modules/common/helpers/points/points';

export function useBuildingRefPointValue(param: string | undefined, building: Building | undefined) {
    const { fetching } = usePoints();
    let value = '';
    let ts = -1;

    const refs = building ? building.pointsXidsRefs : {};
    let pointRefUUID = null;

    if (refs && param) {
        pointRefUUID = refs[param];
    }

    const point = usePoint(pointRefUUID);
    const pointValue = usePointValue(pointRefUUID);

    if (point && pointValue) {
        value = renderPointValue(point, pointValue);
        ts = pointValue.ts;
    }

    return {
        value,
        ts,
        fetching,
        type: point ? point.type : NUMERIC
    };
}