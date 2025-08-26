import { dataStats, tooltipFormat, tooltipLabelFormat, xAxisFormat } from 'modules/consumption/components/ConsumptionLayout/ConsumptionChart/chartFormat';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './ConsumptionChart.module.scss';

interface ConsumptionChartProps {
	data: ConsumptionData;
	period: ConsumptionDatePeriodType | undefined;
	settings: ConsumptionDataRequestSettings & { building: string };
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data, period, settings }) => {
	const { t } = useTranslation();
	const consumptionPeriodLabel = {
		DAY: 'daily',
		WEEK: 'weekly',
		MONTH: 'monthly',
	}[period!];

	const translatedPeriod = t(`data.consumption.params.consumption_period.${consumptionPeriodLabel}`);
	const chartName = `${t(`data.consumption.params.consumption`)} ${translatedPeriod}`;
	const { avg, min, max } = dataStats(data);

	const xAxisDataKey: keyof ConsumptionDataItem = 'index';

	return (
		<ResponsiveContainer className={styles.chart} width='100%' height='100%'>
			<BarChart data={data}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis
					dataKey={xAxisDataKey}
					tick={{ fontSize: '13px', width: '50px' }}
					tickFormatter={xAxisFormat(settings, data)}
					interval={Math.round(data.length * 0.1)}
				/>
				<YAxis />
				<Tooltip formatter={tooltipFormat(settings)} labelFormatter={tooltipLabelFormat(data, settings)} />
				<Bar dataKey='consumption' name={chartName} fill='#5ecc62' />
				<ReferenceLine y={avg} label='ŚREDNIA' stroke='green' strokeWidth={1} strokeDasharray='3 1' />
				<ReferenceLine y={min} label='MIN' stroke='#e01f3d88' strokeWidth={1} strokeDasharray='3 1' />
				<ReferenceLine y={max} label='MAX' stroke='#00ad4588' strokeWidth={1} strokeDasharray='3 1' />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ConsumptionChart;
