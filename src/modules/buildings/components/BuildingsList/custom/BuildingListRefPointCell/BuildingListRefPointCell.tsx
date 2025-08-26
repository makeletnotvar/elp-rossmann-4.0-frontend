import { Tooltip } from '@mui/material';
import { dateString } from 'helpers/date';
import * as React from 'react';
import styles from './BuildingListRefPointCell.module.scss';

interface BuildingListRefPointCellProps {
	value: string | null;
	ts: number;
	rawValue?: number;
	type: PointType;
}

const BuildingListRefPointCell: React.FC<BuildingListRefPointCellProps> = ({ value, ts, type }) => {
	return (
		<Tooltip title={`${value} @ ${dateString(ts)}`} enterDelay={100}>
			<span className={styles.value}>{type === 'numeric' ? parseFloat(String(value)).toFixed(1) : value}</span>
		</Tooltip>
	);
};

export default BuildingListRefPointCell;
