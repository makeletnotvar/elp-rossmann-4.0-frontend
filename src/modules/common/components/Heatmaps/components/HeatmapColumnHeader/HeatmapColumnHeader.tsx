/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */

import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';
import { BOX_SIZE } from '../../constants/layout';

interface HeatmapColumnHeaderProps {
	type: 'DAILY' | 'HOURLY';
	columnHeaders: string[];
}

const HeatmapColumnHeader: React.FC<HeatmapColumnHeaderProps> = ({ type, columnHeaders }) => {
	return (
		<Box
			sx={{
				position: 'sticky',
				top: -1,
				display: 'flex',
				flexDirection: 'row',
				bgcolor: '#fff',
				pt: 1,
				pb: 1,
				ml: 7,
				textAlign: 'center',
				minWidth: type === 'HOURLY' ? '850px' : '1432px',
			}}
		>
			{columnHeaders.map(columnHeader => {
				return (
					<Typography key={columnHeader} style={{ width: type === 'HOURLY' ? BOX_SIZE + 5.75 : BOX_SIZE * 5.73, fontSize: '0.75rem' }}>
						{type === 'HOURLY'
							? `${new Date(columnHeader).toLocaleDateString('pl-PL', {
									day: 'numeric',
							  })}`
							: columnHeader}
					</Typography>
				);
			})}
		</Box>
	);
};

export default memo(HeatmapColumnHeader);
