import Loader from 'modules/common/components/Loaders/Loader';
import DataChart from 'modules/data/components/DataCharts/DataChart/DataChart';
import NoCharts from 'modules/data/components/DataLayout/NoCharts';
import * as React from 'react';
import styles from './DataChartContainer.module.scss';
import {
	getDataTimeRange,
	getEnumOrderedStatesFakeValues,
	mergePointsValues,
	useDataRouter,
	usePointsValues,
	useSpecifiedDataPoints,
} from './DataChartContainerHooks';

const DataChartContainer: React.FC = () => {
	const { pointsUUIDs, from, to } = useDataRouter();
	const { points, fetched, fetching, error } = useSpecifiedDataPoints(pointsUUIDs);
	const { status, values } = usePointsValues(pointsUUIDs, from, to);
	const [commonFromTs, commonToTs] = getDataTimeRange(values);

	/**
	 * Fake values as workaround for correct enum states order in Y axis tooltips
	 */
	const enumOrderedStatesFakeValues = getEnumOrderedStatesFakeValues(points, commonFromTs);

	const chartDataIsFetched = fetched && status === 'FETCHED' && pointsUUIDs.length > 0;

	/**
	 *
	 * We need to extend each point values series with the same, common timestamp range with adding first and last empty (null) value.
	 * This is helpful to keep synchronized charts
	 *
	 */
	return (
		<div className={styles.chartsContainer}>
			{fetching ? (
				<Loader />
			) : chartDataIsFetched ? (
				<DataChart
					points={points || []}
					key={0}
					index={0}
					isLastChartContainer={true}
					data={[...enumOrderedStatesFakeValues, ...mergePointsValues(values)]}
					from={commonFromTs}
					to={commonToTs}
				/>
			) : null}
			{pointsUUIDs.length === 0 && <NoCharts />}
		</div>
	);
};

export default DataChartContainer;
