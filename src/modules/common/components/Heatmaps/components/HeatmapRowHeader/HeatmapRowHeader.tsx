import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';

interface HeatmapRowHeaderProps {
	rowHeaders: string[];
}

const HeatmapRowHeader: React.FC<HeatmapRowHeaderProps> = ({ rowHeaders }) => {
	return (
		<Box
			sx={{
				position: 'sticky',
				left: -1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
				bgcolor: '#fff',
				pl: 1.5,
				pr: 1.5,
			}}
		>
			{rowHeaders.map(rowHeader => {
				return (
					<Typography style={{ fontSize: '0.75rem' }} key={rowHeader}>
						{rowHeader}
					</Typography>
				);
			})}
		</Box>
	);
};

export default memo(HeatmapRowHeader);
