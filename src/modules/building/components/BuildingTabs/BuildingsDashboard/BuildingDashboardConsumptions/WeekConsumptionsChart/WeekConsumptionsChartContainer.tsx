import { DAY_TS } from 'helpers/date';
import Loader from 'modules/common/components/Loaders/Loader';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { dataStats } from 'modules/consumption/components/ConsumptionLayout/ConsumptionChart/chartFormat';
import { consumptionActions, useConsumptionState } from 'modules/consumption/redux/consumption';
import * as React from 'react';
import { useEffect } from 'react';
import { isFetched, isFetching } from 'vredux';
import WeekConsumptionsChart from './WeekConsumptionsChart';
import styles from './WeekConsumptionsChart.module.scss';

interface WeekConsumptionsChartContainerProps {
	building: Building;
}

const useConsumptionData = (building: Building, settings: ConsumptionDataRequestSettings) => {
	const { data, status } = useConsumptionState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (settings && settings.building) {
			dispatch(consumptionActions.fetch(settings));
		}
	}, []);

	return { data, status };
};
const WeekConsumptionsChartContainer: React.FC<WeekConsumptionsChartContainerProps> = ({ building }) => {
	const DAYS_PERIOD_COUNT = 14;
	const settings: ConsumptionDataRequestSettings = {
		building: building.uuid,
		from: Date.now() - DAY_TS * DAYS_PERIOD_COUNT,
		to: Date.now(),
		period: 'DAY',
	};

	const { data, status } = useConsumptionData(building, settings);
	const { avg, min, max } = dataStats(data.data || []);
	return (
		<div className={styles.chart}>
			{isFetched(status) ? (
				<WeekConsumptionsChart data={data.data} avg={avg} min={min} max={max} settings={settings} />
			) : isFetching(status) ? (
				<Loader />
			) : null}
		</div>
	);
};

export default WeekConsumptionsChartContainer;
