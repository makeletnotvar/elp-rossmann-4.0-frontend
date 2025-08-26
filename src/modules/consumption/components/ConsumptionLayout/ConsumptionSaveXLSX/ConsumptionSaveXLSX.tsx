import { IconButton, Tooltip } from '@mui/material';
import { getTimeFromTimestamp } from 'modules/common/helpers/data/time';
import { xAxisFormat } from 'modules/consumption/components/ConsumptionLayout/ConsumptionChart/chartFormat';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import XlsIcon from './XlsIcon';

interface ConsumptionSaveExcelProps {
	buildingName: string;
	data: ConsumptionData;
	period: ConsumptionDatePeriodType | undefined;
	settings: ConsumptionDataRequestSettings & { building: string };
}

const ConsumptionSaveXLSX: React.FC<ConsumptionSaveExcelProps> = ({ buildingName, data, period, settings }) => {
	const { t } = useTranslation();

	const consumptionPeriodLabel = {
		DAY: 'daily',
		WEEK: 'weekly',
		MONTH: 'monthly',
	}[period!];

	const translatedPeriod = t(`data.consumption.params.consumption_period.${consumptionPeriodLabel}`);

	const time = xAxisFormat(settings, data, true);

	const exportToExcel = () => {
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(getExcelData(data, time), { skipHeader: true });
		const columns = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
		worksheet['!cols'] = columns;
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, `${buildingName}@${getTimeFromTimestamp(Date.now())}.xlsx`);
	};

	const getExcelData = (data: ConsumptionData, timeFormatter: (index: number) => string) => {
		const excelData = [['Okres', 'Czas od', 'Czas do', 'Zużycie od', 'Zużycie do', `Zużycie ${translatedPeriod}`]];

		data.forEach((item, index) => {
			const dataFrom = getTimeFromTimestamp(item.startValue.ts);
			const dataTo = getTimeFromTimestamp(item.endValue.ts);
			const consumptionFrom = item.startValue.value.toFixed(1);
			const consumptionTo = item.endValue.value.toFixed(1);
			const consumption = (item.endValue.value - item.startValue.value).toFixed(1);

			excelData.push([timeFormatter(index), dataFrom, dataTo, consumptionFrom, consumptionTo, consumption]);
		});

		return excelData;
	};

	return (
		<Tooltip title={t('data.save', { type: 'XLSX' })}>
			<IconButton onClick={exportToExcel} color='primary'>
				<XlsIcon fontSize='inherit' />
			</IconButton>
		</Tooltip>
	);
};

export default ConsumptionSaveXLSX;
