import { filterObjectProps } from 'helpers/data';
import { getStringsCommonStartPart, trimDash } from 'helpers/strings';
import { capitalize } from 'lodash';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { useFilteredPoints } from 'modules/common/redux/points';
import { useLoadedPointsValues } from 'modules/common/redux/poll';
import * as React from 'react';
import useRouter from 'use-react-router';
import style from './GroupTooltip.module.scss';

interface GroupTooltipProps {
	xidPreffixFilter: string;
}

const GroupTooltip: React.FC<GroupTooltipProps> = ({ xidPreffixFilter }) => {
	const {
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();
	const buildingState = useBuilding(uuid || undefined);
	let buildingXidRefs = {};

	/**
	 * Get all building xidsRefs points, and then filter it by xidPreffixFilter
	 */
	if (buildingState.building) {
		const building: Building = buildingState.building;
		const pointsXidsRefs = building.pointsXidsRefs;

		if (pointsXidsRefs) {
			buildingXidRefs = filterObjectProps(building.pointsXidsRefs || {}, (value, key) => (key as string).includes(xidPreffixFilter));
		}
	}

	const pointsUUIDs: string[] = Object.values(buildingXidRefs as any);
	const pointsValues = useLoadedPointsValues(pointsUUIDs);
	const points = useFilteredPoints(pointsUUIDs);

	const pointsCommonStartPartName = getStringsCommonStartPart(Object.values(points).map(point => (point ? point.name : '')));

	return (
		<div className={style.tooltip}>
			{pointsCommonStartPartName && <div className={style.title}>{trimDash(pointsCommonStartPartName)}</div>}
			{pointsUUIDs.map((uuid: any) => {
				const point = points[uuid];
				const pointValue = pointsValues ? (pointsValues as any)[uuid] : null;
				const pointLabel = (point ? point.name : '??').replace(pointsCommonStartPartName, '');
				const renderedValue = point && pointValue ? renderPointValue(point, pointValue) : '--';

				return <SingleTooltipRow label={pointLabel} value={renderedValue} />;
			})}
		</div>
	);
};

interface SingleTooltipRowProps {
	label: string;
	value: string;
}

const SingleTooltipRow: React.FC<SingleTooltipRowProps> = ({ label, value }) => {
	return (
		<span>
			<label>{capitalize(label)}</label>
			<strong>{value}</strong>
		</span>
	);
};

export default GroupTooltip;
