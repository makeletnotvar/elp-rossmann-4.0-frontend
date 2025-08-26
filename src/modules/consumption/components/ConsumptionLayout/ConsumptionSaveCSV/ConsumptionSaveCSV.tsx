import { getTimeFromTimestamp } from 'modules/common/helpers/data/time';
import { xAxisFormat } from 'modules/consumption/components/ConsumptionLayout/ConsumptionChart/chartFormat';
import React, { useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

interface ConsumptionSaveCSVProps {
	children: React.ReactNode;
	buildingName: string;
	data: ConsumptionData;
	period: ConsumptionDatePeriodType | undefined;
	settings: ConsumptionDataRequestSettings & { building: string };
}

const ConsumptionSaveCSV: React.FC<ConsumptionSaveCSVProps> = ({
	children,
	buildingName,
	data,
	period,
	settings,
}) => {
	const { t } = useTranslation();

	const consumptionPeriodLabel = {
			"DAY": "daily",
			"WEEK": "weekly",
			"MONTH": "monthly"
	}[period!];

	const translatedPeriod = t(`data.consumption.params.consumption_period.${consumptionPeriodLabel}`);

	const time = xAxisFormat(settings, data, true);

	const csvData = useMemo(() => {
		const csvData = data.map((data, index) => {
			const dataFrom = getTimeFromTimestamp(data.startValue.ts);
			const consumptionFrom = data.startValue.value;
			const dataTo = getTimeFromTimestamp(data.endValue.ts);
			const consumptionTo = data.endValue.value;
			const consumption = data.endValue.value - data.startValue.value;
	
			return {
				period: time(index),
				fromTime: dataFrom,
				fromConsumption: consumptionFrom.toFixed(1),
				toTime: dataTo,
				toConsumption: consumptionTo.toFixed(1),
				consumption: consumption.toFixed(1),
			};
		});
		
		return csvData;
	}, [data])

	const csvDataLink = {
		filename: `${buildingName}@${getTimeFromTimestamp(Date.now())}.csv`,
		headers: [
			{ label: 'Okres', key: 'period' },
			{ label: 'Czas od', key: 'fromTime' },
			{ label: 'Czas do', key: 'toTime' },
			{ label: 'Zużycie od', key: 'fromConsumption' },
			{ label: 'Zużycie do', key: 'toConsumption' },
			{ label: `Zużycie ${translatedPeriod}`, key: 'consumption' },
		],
		data: csvData,
		enclosingCharacter: '',
	};

	return <CSVLink {...csvDataLink}>{children}</CSVLink>;
};

export default ConsumptionSaveCSV;
