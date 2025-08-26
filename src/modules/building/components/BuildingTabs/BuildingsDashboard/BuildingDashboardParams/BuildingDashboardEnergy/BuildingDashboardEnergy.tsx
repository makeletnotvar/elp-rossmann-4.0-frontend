import { Paper } from '@mui/material';
import {
	AcUnitOutlined,
	DnsOutlined,
	FastfoodOutlined,
	FlareOutlined,
	MeetingRoomOutlined,
	ReorderOutlined,
	ToysOutlined,
	TrendingDownOutlined,
	TrendingFlatOutlined,
	TrendingUpOutlined,
} from '@mui/icons-material';
import * as React from 'react';
import { Cell, Line, LineChart, Pie, PieChart } from 'recharts';
import styles from './BuildingDashboardEnergy.module.scss';

interface BuildingDashboardEnergyProps {
	building?: Building;
}

export const metersData = [
	{
		name: 'Lodówki',
		value: 43.3,
		color: '#ff4c4c',
		icon: FastfoodOutlined,
	},
	{
		name: 'Oświetlenie',
		value: 17.1,
		color: '#e4e932',
		icon: FlareOutlined,
	},
	{
		name: 'Regały',
		value: 15.8,
		color: '#00c16e',
		icon: ReorderOutlined,
	},
	{
		name: 'Wentylacja',
		value: 19.9,
		color: '#7552cc',
		icon: ToysOutlined,
	},
	{
		name: 'Zaplecze',
		value: 3.8,
		color: '#89ba16',
		icon: MeetingRoomOutlined,
	},
	{
		name: 'Klimatyzatory',
		value: 10.2,
		color: '#f48924',
		icon: AcUnitOutlined,
	},
	{
		name: 'Urządzenia teletechniczne',
		value: 1.1,
		color: '#ffc845',
		icon: DnsOutlined,
	},
];

const BuildingDashboardEnergy: React.FC<BuildingDashboardEnergyProps> = ({ building }) => {
	const SIZE = 400;
	const RADIAN = Math.PI / 180;

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<>
				<text x={x + (x > cx ? 40 : -40)} y={y} fill='#222' style={{ fontSize: '1.5em' }} textAnchor={x > cx ? 'start' : 'end'}>
					{`${(percent * 100).toFixed(1)}%`}
				</text>
				<text x={x + (x > cx ? 40 : -40)} y={y + 12} fill='#333' style={{ fontSize: '0.7em' }} textAnchor={x > cx ? 'start' : 'end'}>
					{metersData[index].name}
				</text>
			</>
		);
	};

	return (
		<Paper square elevation={0} className={styles.container}>
			<div className={styles.title}>
				<h3>Podział zużycia mediów</h3>
			</div>
			<div className={styles.row}>
				<PieChart width={SIZE + 120} height={SIZE} style={{ marginRight: 40 }}>
					<Pie
						data={metersData}
						dataKey='value'
						nameKey='name'
						cy={180}
						cx={220}
						innerRadius={100}
						outerRadius={(SIZE / 2) * 0.75}
						labelLine={false}
						label={renderCustomizedLabel}
					>
						{metersData.map((entry, index) => (
							<Cell fill={metersData[index].color} />
						))}
					</Pie>
				</PieChart>
				<div className={styles.legend}>
					<h4>Legenda</h4>
					<div className={styles.items}>
						{metersData.map((item, index) => {
							const Icon = item.icon;
							let c = 100;
							const data = [];

							for (let i = 0; i <= 30; i++) {
								const change = -50 + Math.random() * 100;
								data.push({ value: c });
								c += change;
							}

							const isGrowing = data[15].value < data[30].value;
							const isFlat = Math.abs(data[15].value - data[30].value) < 50;

							return (
								<div key={item.name} className={styles.item}>
									<div className={styles.color}>
										<span style={{ borderColor: item.color }}></span>
									</div>
									<div className={styles.icon}>
										<Icon />
									</div>
									<div className={styles.name}>{item.name}</div>
									<div className={styles.chart}>
										<LineChart width={200} height={30} data={data}>
											<Line type='monotone' dataKey='value' stroke={!index ? '#ff4c4c' : '#888'} dot={false} strokeWidth={1.5} />
										</LineChart>
									</div>
									<div className={styles.value} style={{ color: !index ? '#ff4c4c' : '#555' }}>
										{(((item.value / 100) * 5483) / 30).toFixed(0)}
										<span>kW/h</span>
									</div>
									<div className={styles.value} style={{ color: !index ? '#ff4c4c' : '#555' }}>
										{(((item.value / 100) * 5483) / 7).toFixed(0)}
										<span>kW/h</span>
									</div>
									<div className={styles.value} style={{ color: !index ? '#ff4c4c' : '#555' }}>
										{((item.value / 100) * 5483).toFixed(0)}
										<span>kW/h</span>
									</div>
									<div className={styles.percentage} style={{ color: !index ? '#ff4c4c' : '#555' }}>
										{item.value}
										<span>%</span>
									</div>
									<div className={styles.trend}>
										{isFlat ? (
											<TrendingFlatOutlined width={16} style={{ fill: '#888' }} />
										) : isGrowing ? (
											<TrendingUpOutlined width={16} style={{ fill: '#fe5000' }} />
										) : (
											<TrendingDownOutlined width={16} style={{ fill: '#34bf49' }} />
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Paper>
	);
};

export default BuildingDashboardEnergy;
