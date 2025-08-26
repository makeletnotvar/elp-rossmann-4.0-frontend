import { useDataRouter } from 'modules/data/components/DataCharts/DataChartContainerHooks';
import * as React from 'react';
import { useState } from 'react';
import { useChartStatsState } from '../../../../redux/chartStats';
import ChartStats from './ChartStats';

export interface ChartStatsContainerProps {
	onClose: () => void;
	points: Point[];
}

function useChartStats(points: Point[]) {
	const [activePoint, setActivePoint] = useState<string>(points[0].uuid!);
	const { from, to } = useDataRouter();
	const {
		data: { statistics },
	} = useChartStatsState();

	const activePointStatistics = statistics[activePoint] || null;

	return {
		activePoint,
		setActivePoint,
		from,
		to,
		activePointStatistics,
	};
}

const ChartStatsContainer: React.FC<ChartStatsContainerProps> = ({ onClose, points }) => {
	const { activePoint, setActivePoint, from, to, activePointStatistics } = useChartStats(points);

	return (
		<ChartStats
			{...{
				points,
				onClose,
				activePoint,
				onChangePoint: setActivePoint,
				from,
				to,
				statistics: activePointStatistics,
			}}
		/>
	);
};

export default ChartStatsContainer;
