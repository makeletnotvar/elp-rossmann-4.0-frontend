import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import { useMemo } from 'react';

export default (pointUUID: string | null, pointXid?: string, defaultValue: string = '--', withoutSuffix?: boolean): string => {
	const point = usePoint(pointUUID, pointXid);
	const rawPointValue = usePointValue(point?.uuid);

	const renderedValue = useMemo(() => {
		return point && rawPointValue ? renderPointValue(point, rawPointValue, defaultValue, withoutSuffix) : 0;
	}, [rawPointValue, point, pointUUID, pointXid, withoutSuffix]);

	return renderedValue || defaultValue;
};
