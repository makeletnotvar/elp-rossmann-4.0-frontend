import {
	dataStats,
	tooltipFormat,
	tooltipLabelFormat,
	xAxisFormat,
} from 'modules/media/components/MediaTabs/MediaConsumptions/MediaConsumptionsChart/MediaConsumptionsChartFormat';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './MediaConsumptionsChart.module.scss';

interface MediaConsumptionsChartProps {
	data: ConsumptionData;
	period: MediaCosumptionsPeriodType | undefined;
	settings: MediaConsumptionsRequestSettings;
}

const ConsumptionChart: React.FC<MediaConsumptionsChartProps> = ({ data, period, settings }) => {
	const { t } = useTranslation();
	const consumptionPeriodLabel = {
		HOUR: 'hourly',
		DAY: 'daily',
		WEEK: 'weekly',
		MONTH: 'monthly',
	}[period!];

	const translatedPeriod = t(`data.consumption.params.consumption_period.${consumptionPeriodLabel}`);
	const chartName = `${t(`data.consumption.params.consumption`)} ${translatedPeriod}`;
	const { avg, min, max } = dataStats(data);
	const valuesEqual = avg === min && min === max;
	const xAxisDataKey: keyof ConsumptionDataItem = 'index';
	const barColor = settings.source === 'AC' ? '#00bce4' : '#00c16e';

	return (
		<ResponsiveContainer className={styles.chart} width='99%' height='99%'>
			<BarChart data={data} margin={{ top: 20, right: 60, bottom: 20 }}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis
					dataKey={xAxisDataKey}
					tick={{ fontSize: '13px', width: '50px' }}
					tickFormatter={xAxisFormat(settings, data)}
					interval={Math.round(data.length * 0.1)}
				/>
				<YAxis />
				<Tooltip formatter={tooltipFormat(settings)} labelFormatter={tooltipLabelFormat(data, settings)} />
				<Bar dataKey='consumption' name={chartName} fill={barColor} />
				{!valuesEqual && <ReferenceLine y={avg} label='ŚREDNIA' stroke='green' strokeWidth={1} strokeDasharray='3 1' />}
				{!valuesEqual && <ReferenceLine y={min} label='MIN' stroke='#e01f3d88' strokeWidth={1} strokeDasharray='3 1' />}
				<ReferenceLine y={max} label='MAX' stroke='#00ad4588' strokeWidth={1} strokeDasharray='3 1' />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ConsumptionChart;
