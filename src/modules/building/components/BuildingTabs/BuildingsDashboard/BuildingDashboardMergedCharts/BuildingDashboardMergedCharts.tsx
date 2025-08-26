import { Paper } from '@mui/material';
import { metersData } from 'modules/building/components/BuildingTabs/BuildingsDashboard/BuildingDashboardParams/BuildingDashboardEnergy/BuildingDashboardEnergy';
import * as React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './BuildingDashboardMergedCharts.module.scss';

interface BuildingDashboardMergedChartsProps {}

const data = [
	{
		a: 45,
		b: 19,
		c: 20,
		d: 40,
		e: 10,
		f: 20,
		g: 50,
	},
];

for (let i = 1; i < 100; i++) {
	data.push({
		a: data[i - 1].a + (-2 + Math.random() * 4),
		b: data[i - 1].b + (-2 + Math.random() * 4),
		c: data[i - 1].c + (-2 + Math.random() * 4),
		d: data[i - 1].d + (-2 + Math.random() * 4),
		e: data[i - 1].e + (-2 + Math.random() * 4),
		f: data[i - 1].f + (-2 + Math.random() * 4),
		g: data[i - 1].g + (-2 + Math.random() * 4),
	});
}

const BuildingDashboardMergedCharts: React.FC<BuildingDashboardMergedChartsProps> = () => {
	return (
		<Paper elevation={0} className={styles.container}>
			<LineChart height={205} width={1780} data={data}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				{Object.keys(data[0]).map((key, index) => {
					const meter = metersData[index];
					return <Line type='monotone' key={key} dataKey={key} dot={false} strokeWidth={1} stroke={meter.color} name={meter.name} />;
				})}
			</LineChart>
		</Paper>
	);
};

export default BuildingDashboardMergedCharts;
