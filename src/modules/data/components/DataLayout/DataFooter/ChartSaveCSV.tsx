import { getTimeFromTimestamp } from 'modules/common/helpers/data/time';
import { renderPointRawValue } from 'modules/common/helpers/points/renderers';
import {
	getDataTimeRange,
	getEnumOrderedStatesFakeValues,
	mergePointsValues,
	useDataRouter,
	usePointsValues,
	useSpecifiedDataPoints,
} from 'modules/data/components/DataCharts/DataChartContainerHooks';
import { getPointFullName } from 'modules/data/components/DataPoints/DataPointsHooks';
import * as React from 'react';
import { useMemo } from 'react';
import { CSVLink } from 'react-csv';

type GroupedPointsType = {
	[key: string]: MergedDataPointsValue[];
};

function groupDataPointsByTime(dataPoints: MergedDataPointsValue[]): GroupedPointsType {
	return dataPoints.reduce((groupedPoints, dataPoint) => {
		const groupPointsName = getTimeFromTimestamp(dataPoint.ts);
		if (!groupedPoints[groupPointsName]) {
			groupedPoints[groupPointsName] = [];
		}
		groupedPoints[groupPointsName].push(dataPoint);
		return groupedPoints;
	}, {} as GroupedPointsType);
}

type CsvDataType = {
	[key: string]: { pointData: string };
};

interface CsvData {
	date: string;
	time: string;
	pointsData: CsvDataType[];
}

const ChartSaveCSV: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { pointsUUIDs, from, to } = useDataRouter();
	const { points } = useSpecifiedDataPoints(pointsUUIDs);
	const { values } = usePointsValues(pointsUUIDs, from, to);
	const [commonFromTs] = getDataTimeRange(values);
	const enumOrderedStatesFakeValues = getEnumOrderedStatesFakeValues(points, commonFromTs);

	const dataTimesValues = [...enumOrderedStatesFakeValues, ...mergePointsValues(values)];

	const groupedDataPoints = groupDataPointsByTime(dataTimesValues);

	const csvData = useMemo(() => {
		const csvData = Object.entries(groupedDataPoints).map(([date, values]): CsvData[] => {
			const dataPointsValues = values.reduce((acc: any, value: MergedDataPointsValue) => {
				const valueEntries = Object.entries(value);
				const valuePoint = points.filter(point => point.uuid === valueEntries[0][0]);

				if (valuePoint.length > 0) {
					return {
						...acc,
						[String(valuePoint[0].uuid)]: renderPointRawValue(valuePoint[0], Number(valueEntries[0][1])),
					};
				}
			}, {} as CsvDataType);

			return {
				time: date,
				...dataPointsValues,
			};
		});

		return csvData;
	}, [groupedDataPoints]);

	const csvHeaders = points.map(point => {
		return {
			label: getPointFullName(point),
			key: String(point.uuid),
		};
	});

	const csvDataLink = {
		filename: `DataExport@${getTimeFromTimestamp(Date.now())}.csv`,
		headers: [{ label: 'Czas', key: 'time' }, ...csvHeaders],
		data: csvData,
		enclosingCharacter: '',
	};

	return <CSVLink {...csvDataLink}>{children}</CSVLink>;
};

export default ChartSaveCSV;
