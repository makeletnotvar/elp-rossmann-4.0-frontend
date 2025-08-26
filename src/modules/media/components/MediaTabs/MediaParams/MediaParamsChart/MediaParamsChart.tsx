import { isEnumPoint, isNumericPoint } from 'modules/common/helpers/points/points';
import { renderPointRawValue } from 'modules/common/helpers/points/renderers';
import { DataChartProps } from 'modules/data/components/DataCharts/DataChart/DataChart';
import { getMergedYAxises } from 'modules/data/helpers/chartsAxis';
import { getChartLineColor } from 'modules/data/helpers/chartsColors';
import { timeAxisLabelsFormatter, tooltipLabelFormatter, tooltipValueFormatter } from 'modules/data/helpers/chartsFormat';
import { getChartPointName, getPointUnit } from 'modules/data/helpers/chartsLabels';
import MediaParamsChartLegend from 'modules/media/components/MediaTabs/MediaParams/MediaParamsChart/MediaParamsChartLegend';
import * as React from 'react';
import { useState } from 'react';
import { Area, Brush, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './MediaParamsChart.module.scss';

interface PointMediaParamsChartProps extends Pick<DataChartProps, 'data' | 'points' | 'from' | 'to' | 'index'> {
	hideXLabels?: boolean;
	isLastChartContainer?: boolean; // is last chart container
}

/**
 *
 * It's not possible to wrap Reacharts elements into separate components
 *
 * @param param0
 *
 */
const MediaParamsChart: React.FC<PointMediaParamsChartProps> = ({ points, data, hideXLabels = false, isLastChartContainer, from, to }) => {
	const [hiddenPoints, setHiddenPoints] = useState<string[]>([]);
	const { yAxises, pointsOfYAxises } = getMergedYAxises(points);

	const handlePointClick = (pointXid: string) => {
		if (hiddenPoints.includes(pointXid)) {
			setHiddenPoints(hiddenPoints.filter(xid => xid !== pointXid));
		} else {
			setHiddenPoints([...hiddenPoints, pointXid]);
		}
	};

	return (
		<ResponsiveContainer width='99%' height='99%' className={styles.container}>
			<ComposedChart data={data}>
				{/* Code is messy, because if YAxis is wrapped or delegate to any other component Recharts crashes */}

				{
					/**
					 * Y-AXISes
					 *
					 * Render depends on point type.
					 *
					 */
					[...yAxises].map(([yAxisId, point], index) => {
						return isEnumPoint(point) ? (
							<YAxis
								scale='auto'
								type='category'
								tickFormatter={(value: any) => renderPointRawValue(point, value)}
								ticks={Object.keys((point.customRender as EnumRender).states).map(Number)}
								domain={[(dataMin: number) => dataMin - 1, (dataMax: number) => dataMax + 1]}
								tick={{ stroke: '555', fontSize: 10, fontWeight: 400 }}
								width={80}
								key={yAxisId}
								stroke={getChartLineColor(point.uuid || '')}
								padding={{ bottom: 20, top: 20 }}
								interval={0}
								yAxisId={yAxisId}
								orientation={index % 2 ? 'left' : 'right'}
								hide={hiddenPoints.includes(point.xid!)}
							/>
						) : (
							<YAxis
								scale='linear'
								type='number'
								domain={['auto', 'auto']}
								tick={{ stroke: '555', fontSize: 10, fontWeight: 400 }}
								stroke={getChartLineColor(point.uuid || '')}
								padding={{ bottom: 20, top: 20 }}
								yAxisId={yAxisId}
								key={yAxisId}
								orientation={index % 2 ? 'left' : 'right'}
								unit={getPointUnit(point)}
								hide={hiddenPoints.includes(point.xid!)}
							/>
						);
					})
				}

				{/*
				 *
				 * Bottom timeline
				 *
				 *
				 */}
				<XAxis
					scale='time'
					type='number'
					dataKey='ts'
					hide={hideXLabels}
					tickFormatter={timeAxisLabelsFormatter(from, to)}
					tick={{ fontSize: 10 }}
					domain={['dataMin', 'dataMax']}
				/>

				{/*
				 *
				 * Custom Tooltip
				 *
				 *
				 */}
				<Tooltip
					labelStyle={{ fontSize: 14 }}
					contentStyle={{ fontSize: 12 }}
					formatter={tooltipValueFormatter(points)}
					labelFormatter={tooltipLabelFormatter}
				/>

				<CartesianGrid stroke='#ddd' />

				{/*
				 *
				 * Custom legend
				 *
				 *
				 */}
				<Legend
					verticalAlign='top'
					height={36}
					wrapperStyle={{ fontSize: '0.75em' }}
					content={<MediaParamsChartLegend points={points} hiddenPoints={hiddenPoints} handlePointClick={handlePointClick} />}
				/>

				{/*
				 * Workaround to keep right order of enum YAxis tooltips (states).
				 * Fake data for those line is in dataKeys started with $
				 * Whole lines are hidden.
				 */}
				{points.filter(isEnumPoint).map(point => (
					<Line
						key={`$${point.uuid}`}
						dataKey={`$${point.uuid}`}
						yAxisId={pointsOfYAxises.get(point.uuid || '')}
						visibility='hidden'
						hide={hiddenPoints.includes(point.xid!)}
					/>
				))}
				{
					/**
					 * Firstly render all enum points to place it in background
					 */
					points.filter(isEnumPoint).map((point, index) => {
						const color = getChartLineColor(point.uuid!);
						const yAxisId = pointsOfYAxises.get(point.uuid || '');

						return (
							<Area
								key={point.uuid}
								type='stepAfter'
								animationDuration={0}
								dataKey={point.uuid!}
								stroke={color}
								dot={{ r: 1.2 }}
								strokeWidth={1}
								fill={color}
								fillOpacity={0.22}
								connectNulls={true}
								isAnimationActive={false}
								yAxisId={yAxisId}
								name={getChartPointName(point)}
								hide={hiddenPoints.includes(point.xid!)}
							/>
						);
					})
				}
				{
					/**
					 * Then render all numeric points to place it in foreground
					 */
					points.filter(isNumericPoint).map((point, index) => {
						const color = getChartLineColor(point.uuid!);
						const yAxisId = pointsOfYAxises.get(point.uuid || '');

						return (
							<Line
								key={point.uuid}
								type='linear'
								animationDuration={0}
								dataKey={point.uuid!}
								stroke={color}
								dot={{ r: 1 }}
								strokeWidth={1.8}
								connectNulls={true}
								isAnimationActive={false}
								yAxisId={yAxisId}
								name={getChartPointName(point)}
								hide={hiddenPoints.includes(point.xid!)}
							/>
						);
					})
				}
				{
					/*
					 * Brush is scroll bar to select and zoom time range.
					 * It's only rendered in last chart container.
					 */
					isLastChartContainer && (
						<Brush data={data} dataKey='ts' height={20} fill='#ddd' stroke='#555' tickFormatter={timeAxisLabelsFormatter(from, to)} className={styles.brush} />
					)
				}
			</ComposedChart>
		</ResponsiveContainer>
	);
};

export default MediaParamsChart;
