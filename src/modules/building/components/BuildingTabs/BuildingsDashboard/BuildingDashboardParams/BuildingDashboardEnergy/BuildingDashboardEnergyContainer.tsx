import { DAY_TS } from 'helpers/date';
import Loader from 'modules/common/components/Loaders/Loader';
import { mapBuildingPointsXidsToUuids } from 'modules/common/helpers/points/points';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { chartDataActions, useChartDataState } from 'modules/data/redux/chartData';
import * as React from 'react';
import { useEffect } from 'react';
import { isFetched, isFetching } from 'vredux';
import BuildingDashboardEnergy from './BuildingDashboardEnergy';
// const styles = require("./BuildingDashboardEnergy.scss");

interface BuildingDashboardEnergyProps {
	building: Building;
}

const POINTS: string[] = ['tavr'];

const useChartData = (building: Building) => {
	const dispatch = useDispatch();
	const { data, status } = useChartDataState();

	building.pointsXidsRefs;

	useEffect(() => {
		const points = mapBuildingPointsXidsToUuids(building, POINTS);
		const to = Date.now();
		const from = to - DAY_TS * 7;

		dispatch(chartDataActions.fetch({ points, from, to }));
	}, [building.uuid]);

	return { data, status };
};

const BuildingDashboardEnergyContainer: React.FC<BuildingDashboardEnergyProps> = ({ building }) => {
	const { data, status } = useChartData(building);

	return <>{isFetched(status) ? <BuildingDashboardEnergy /> : isFetching(status) ? <Loader /> : null}</>;
};

export default BuildingDashboardEnergyContainer;
