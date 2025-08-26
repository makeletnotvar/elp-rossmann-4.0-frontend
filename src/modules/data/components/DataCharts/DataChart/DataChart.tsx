import { getPointsChartName } from 'modules/data/helpers/chartsLabels';
import * as React from 'react';
import { useState } from 'react';
import Chart from './Chart/Chart';
import ChartStatsContainer from './ChartStats/ChartStatsContainer';
import ChartWrapper from './ChartWrapper/ChartWrapper';

export interface DataChartProps {
	points: Point[];
	index: number;
	isLastChartContainer: boolean;
	data: MergedDataPointsValue[];
	from: number;
	to: number;
}

const DataChart: React.FC<DataChartProps> = ({ points, data, index, isLastChartContainer, from, to }) => {
	const name = getPointsChartName(points);
	const [statsOpen, setStatsOpen] = useState<boolean>(false);

	return (
		<ChartWrapper title={name} onStatsOpen={() => setStatsOpen(true)}>
			<Chart {...{ points, data, index, from, to, isLastChartContainer }} />
			{statsOpen && <ChartStatsContainer onClose={() => setStatsOpen(false)} points={points} />}
		</ChartWrapper>
	);
};

export default DataChart;
