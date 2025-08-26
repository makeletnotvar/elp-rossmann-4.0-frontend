/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */

import { Box, Typography } from '@mui/material';
import { AccessAlarmOutlined, CalendarTodayOutlined, NotificationsActiveOutlined } from '@mui/icons-material';
import React, { memo } from 'react';

interface HeatmapEmptyBoxTooltipProps {
	datetime?: string;
	includeHours?: boolean;
}

const HeatmapEmptyBoxTooltip: React.FC<HeatmapEmptyBoxTooltipProps> = ({ datetime, includeHours }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gridGap: 3 }}>
			<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
				<CalendarTodayOutlined fontSize='inherit' style={{ marginRight: 0.15 }} />
				<Typography style={{ fontSize: '12px' }}>Data: </Typography>
				<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600 }}>
					{datetime
						? new Date(datetime).toLocaleString('pl-PL', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
						  })
						: 'Brak'}
				</Typography>
			</Typography>
			{includeHours && (
				<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
					<AccessAlarmOutlined fontSize='inherit' style={{ marginRight: 0.15 }} />
					<Typography style={{ fontSize: '12px' }}>Godzina: </Typography>
					<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600 }}>
						{datetime
							? new Date(datetime).toLocaleString('pl-PL', {
									hour: 'numeric',
									minute: '2-digit',
							  })
							: 'Brak'}
					</Typography>
				</Typography>
			)}
			<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
				<NotificationsActiveOutlined fontSize='inherit' style={{ marginRight: 0.15 }} />
				<Typography style={{ fontSize: '12px' }}>Ilość alarmów: </Typography>
				<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600 }}>Brak</Typography>
			</Typography>
		</Box>
	);
};

export default memo(HeatmapEmptyBoxTooltip);
