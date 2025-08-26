import { Box } from '@mui/material';
import React, { memo } from 'react';
import useRowSummary from '../../hooks/useRowSummary';
import RowSummary from './RowSummary/RowSummary';

interface HeatmapRowSummaryProps {
	rowHeaders: string[];
	type: 'DAILY' | 'HOURLY';
	data: EventHeatmaps[];
}

const HeatmapRowSummary: React.FC<HeatmapRowSummaryProps> = ({ data, type, rowHeaders }) => {
	const rowSummaryData = useRowSummary(data, rowHeaders, type);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
				bgcolor: '#fff',
				pl: 1.5,
				pr: 1.5,
				fontSize: '0.75rem',
			}}
		>
			{Object.entries(rowSummaryData).map(([datetime, value]) => (
				<RowSummary key={datetime} type={type} rowSummaryData={rowSummaryData} datetime={datetime} value={value} />
			))}
		</Box>
	);
};

export default memo(HeatmapRowSummary);
