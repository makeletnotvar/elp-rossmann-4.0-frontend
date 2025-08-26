import { FormControl, MenuItem, Select } from '@mui/material';
import { getChartPointName } from 'modules/data/helpers/chartsLabels';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChartStats.module.scss';

interface ChartStatsPointsLinksProps {
	points: Point[];
	onChange: (next: string) => void;
	active: string;
}

const ChartStatsPointsLinks: React.FC<ChartStatsPointsLinksProps> = ({ points, onChange, active }) => {
	const { t } = useTranslation();

	return (
		<FormControl className={styles.links}>
			<Select
				value={active}
				onChange={evt => onChange(evt.target.value)}
				inputProps={{
					name: 'point',
				}}
			>
				{points.map(point => (
					<MenuItem key={point.uuid} value={point.uuid}>
						{getChartPointName(point)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default ChartStatsPointsLinks;
