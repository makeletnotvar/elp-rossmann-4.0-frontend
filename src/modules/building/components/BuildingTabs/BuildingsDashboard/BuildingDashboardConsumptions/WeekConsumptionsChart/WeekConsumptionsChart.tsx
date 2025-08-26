import { tooltipFormat, tooltipLabelFormat } from 'modules/consumption/components/ConsumptionLayout/ConsumptionChart/chartFormat';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './WeekConsumptionsChart.module.scss';

interface WeekConsumptionsChartProps {
	data: ConsumptionData;
	max: number;
	min: number;
	avg: number;
	settings: ConsumptionDataRequestSettings;
}

const WeekConsumptionsChart: React.FC<WeekConsumptionsChartProps> = ({ data, min, max, avg, settings }) => {
	const MIN_COLOR = '#0abf53';
	const MAX_COLOR = '#e80033';
	const DEFAULT_COLOR = '#0abf53';
	const SUNDAY_COLOR = '#dddddd';

	return (
		<div className={styles.chartContainer}>
			<div className={styles.title}>Ostatnie 14 dni</div>
			<ResponsiveContainer width='100%' height={120}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray='1 1' />
					<Tooltip formatter={tooltipFormat(settings)} labelFormatter={tooltipLabelFormat(data, settings)} />
					<Bar dataKey='consumption' fill='#5ecc62'>
						{data.map((entry, index) => {
							const value = (data[index] as any).consumption;
							const date = new Date(data[index].startValue.ts);
							const isSunday = date.getDay() === 6;

							const color = value === min ? MIN_COLOR : value === max ? MAX_COLOR : isSunday ? SUNDAY_COLOR : DEFAULT_COLOR;

							return <Cell fill={color} />;
						})}
					</Bar>
					<ReferenceLine y={avg} stroke='#888' strokeWidth={0.3} strokeDasharray='3 3' />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default WeekConsumptionsChart;
