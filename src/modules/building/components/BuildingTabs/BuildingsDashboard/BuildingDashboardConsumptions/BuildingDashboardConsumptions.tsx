import LastConsumptionsBars from 'modules/building/components/BuildingTabs/BuildingsDashboard/BuildingDashboardConsumptions/LastConsumptionsBars/LastConsumptionsBars';
import WeekConsumptionsChartContainer from 'modules/building/components/BuildingTabs/BuildingsDashboard/BuildingDashboardConsumptions/WeekConsumptionsChart/WeekConsumptionsChartContainer';
import BuildingDashboardRank from 'modules/building/components/BuildingTabs/BuildingsDashboard/BuildingDashboardRank/BuildingDashboardRank';
import * as React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import styles from './BuildingDashboardConsumptions.module.scss';

interface BuildingDashboardConsumptionsProps {
	building: Building;
}

const BuildingDashboardConsumptions: React.FC<BuildingDashboardConsumptionsProps> = ({ building }) => {
	return (
		<div className={styles.consumptions}>
			<LastConsumptionsBars building={building} />
			<WeekConsumptionsChartContainer building={building} />
			<BuildingDashboardRank />
		</div>
	);
};

export default BuildingDashboardConsumptions;
