import { usePoints } from 'modules/common/redux/points';
import { useMemo } from 'react';

export function useCurrentBuildingPoints(xids: string[]): Point[] | null {
	const { points } = usePoints();

	const currentBuildingPoints = useMemo(
		() => points.filter(point => xids.map(xid => xid?.toLocaleLowerCase() || '').includes(point.xid?.toLowerCase() || '')),
		[xids, points]
	) as Point[];

	if ((currentBuildingPoints || []).length <= 0) {
		return null;
	}

	return currentBuildingPoints;
}
