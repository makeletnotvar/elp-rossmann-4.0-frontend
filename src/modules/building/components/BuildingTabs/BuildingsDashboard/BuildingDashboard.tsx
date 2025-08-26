import { Paper } from '@mui/material';
import * as React from 'react';
import styles from './BuildingDashboard.module.scss';
import BuildingDashboardConsumptions from './BuildingDashboardConsumptions/BuildingDashboardConsumptions';
import BuildingDashboardParams from './BuildingDashboardParams/BuildingDashboardParams';

interface BuildingDashboardProps {
	building: Building;
}

const BuildingDashboard: React.FC<BuildingDashboardProps> = ({ building }) => {
	return (
		<div className={styles.container}>
			<div className={styles.row}>
				<BuildingDashboardConsumptions building={building} />
			</div>
			<div className={styles.row}>
				<BuildingDashboardParams building={building} />
			</div>
			<div className={styles.row}>
				{/* <BuildingDashboardMergedCharts/> */}
				<Paper elevation={0} style={{ width: '100%', height: 210 }} />
			</div>
		</div>
	);
};

export default BuildingDashboard;
