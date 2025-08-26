import { GpsOffOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { isNumber } from 'lodash';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import styles from './BuildingListConsumptionCell.module.scss';

interface BuildingListConsumptionCellProps {
	param: keyof RossmannBuildingConsumption;
}

const BuildingListConsumptionCell: React.FC<Pick<SuperTableCustomCellProps, 'row'> & BuildingListConsumptionCellProps> = ({ param, row }) => {
	const consumptions = row.consumptions || {};
	const paramValue: number | null = consumptions[param];

	const area = row.area || 0;
	const isValidConsumptionValue = isNumber(paramValue);
	const consumption = paramValue || 0;
	const consumptionPerMeter = (consumption / area).toFixed(2);

	return (
		<>
			{isValidConsumptionValue ? (
				<>
					{consumption} <span className={styles.perMeter}>({consumptionPerMeter}/m²)</span>
				</>
			) : (
				<Tooltip title='Brak danych z tego okresu'>
					<GpsOffOutlined style={{ fontSize: 18, color: '#ffc845' }} />
				</Tooltip>
			)}
		</>
	);
};

export default BuildingListConsumptionCell;
