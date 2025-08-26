import { Tooltip } from '@mui/material';
import { renderPointValue, renderPointValueTime } from 'modules/common/helpers/points/renderers';
import { PollData, usePoll } from 'modules/common/redux/poll';
import { getChartLineColor } from 'modules/data/helpers/chartsColors';
import * as React from 'react';
import styles from './MediaParamsChartLegend.module.scss';

interface MediaParamsChartLegendProps {
	points: Point[];
	hiddenPoints: string[];
	handlePointClick: (pointXid: string) => void;
}

const MediaParamsChartLegend: React.FC<MediaParamsChartLegendProps> = ({ points, hiddenPoints, handlePointClick }) => {
	usePoll();

	return (
		<ul className={styles.legend}>
			{points.map(point => (
				<MediaParamsChartLegendItem point={point} hiddenPoints={hiddenPoints} handlePointClick={handlePointClick} key={point.uuid} />
			))}
		</ul>
	);
};

const MediaParamsChartLegendItem: React.FC<{
	point: Point;
	hiddenPoints: string[];
	handlePointClick: (pointXid: string) => void;
}> = ({ point, hiddenPoints, handlePointClick }) => {
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
		<li
			className={styles.item}
			style={{
				textDecoration: hiddenPoints.includes(point.xid!) ? 'line-through' : 'none',
			}}
			onClick={() => handlePointClick(point.xid!)}
		>
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

export default MediaParamsChartLegend;
