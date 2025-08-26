import { Tooltip } from '@mui/material';
import { renderPointValue, renderPointValueTime } from 'modules/common/helpers/points/renderers';
import { PollData, usePoll } from 'modules/common/redux/poll';
import { getChartLineColor } from 'modules/data/helpers/chartsColors';
import * as React from 'react';
import styles from './ChartLegend.module.scss';

interface ChartLegendProps {
	points: Point[];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ points }) => {
	usePoll();

	return (
		<ul className={styles.legend}>
			{points.map(point => (
				<ChartLegendItem point={point} key={point.uuid} />
			))}
		</ul>
	);
};

const ChartLegendItem: React.FC<{ point: Point }> = ({ point }) => {
	const pollState = usePoll();
	const pollData: PollData = pollState.data || {};
	const pointValue: PointValue | undefined = pollData.pointsValues[point.uuid || ''];
	let renderedValue = '?';
	let tooltip = '';

	if (pointValue) {
		renderedValue = renderPointValue(point, pointValue);
		tooltip = renderPointValueTime(point, pointValue);
	}

	return (
		<li className={styles.item}>
			<span style={{ background: getChartLineColor(point.uuid || '') }}></span>
			<label>
				{point.name || point.xid}
				<Tooltip title={tooltip}>
					<strong>{renderedValue}</strong>
				</Tooltip>
			</label>
		</li>
	);
};

export default ChartLegend;
