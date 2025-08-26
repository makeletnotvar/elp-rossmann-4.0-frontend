import { usePoints } from 'modules/common/redux/points';
import { useMemo } from 'react';

export function useCurrentBuildingPoint(xids: string[]): Point | null {
	const { points } = usePoints();

	const point = useMemo(
		() => points.find(point => xids.map(xid => xid?.toLocaleLowerCase() || '').includes(point.xid?.toLocaleLowerCase() || '')),
		[xids, points]
	) as Point;

	if (!point) {
		return null;
	}

	return point;
}
