import { entriesToObjectReducer } from 'helpers/data';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { usePoll } from 'modules/common/redux/poll';
import { useMemo } from 'react';

export const usePollValues = (deviceUUID: string, points: Point[]) => {
  const {
    data: { pointsValues },
  } = usePoll();

  const pointXidValues = useMemo(
    () =>
      points
        .map(point => {
          if (point && point.uuid) {
            const pointValue = pointsValues[point.uuid];
            const renderedValue = renderPointValue(point, pointValue);
            return [point.xid, renderedValue];
          } else {
            return null;
          }
        })
        .filter(result => result !== null)
        .reduce(entriesToObjectReducer, {}),
    [deviceUUID, pointsValues]
  );

  return pointXidValues;
};