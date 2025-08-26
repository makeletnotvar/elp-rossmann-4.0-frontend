import { IconButton, Tooltip } from '@mui/material';
import cn from 'classnames';
import ConsumptionSaveCSV from 'modules/consumption/components/ConsumptionLayout/ConsumptionSaveCSV/ConsumptionSaveCSV';
import { ConsumptionDataData } from 'modules/consumption/redux/consumption';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import ConsumptionChart from './ConsumptionChart/ConsumptionChart';
import styles from './ConsumptionLayout.module.scss';
import CsvIcon from './ConsumptionSaveCSV/CsvIcon';
import ConsumptionSaveXLSX from './ConsumptionSaveXLSX/ConsumptionSaveXLSX';

interface ConsumptionLayoutProps {
	data: ConsumptionDataData;
	settings: ConsumptionDataRequestSettings & { building: string };
	fetching: boolean;
	building: Reference;
	isOpenMenu: boolean;
}

const ConsumptionLayout: React.FC<ConsumptionLayoutProps> = ({ data, settings, fetching, building, isOpenMenu }) => {
	const { t } = useTranslation();

	return (
		<div className={cn(styles.chartContainer, { [styles.fetching]: fetching, [styles.hiddenOverflow]: isOpenMenu })}>
			<div>
				<h3 className={styles.title}>{building.name}</h3>
				<div data-testid='chart-display' className={styles.wrapper}>
					<ConsumptionChart data={data.data} period={data.period} settings={settings} />
				</div>
			</div>
			<div className={styles.footer}>
				<ConsumptionSaveCSV buildingName={building.name} data={data.data} period={data.period} settings={settings}>
					<Tooltip title={t('data.save', { type: 'CSV' })}>
						<IconButton color='primary'>
							<CsvIcon fontSize='inherit' />
						</IconButton>
					</Tooltip>
				</ConsumptionSaveCSV>
				<ConsumptionSaveXLSX buildingName={building.name} data={data.data} period={data.period} settings={settings} />
			</div>
		</div>
	);
};

export default ConsumptionLayout;
