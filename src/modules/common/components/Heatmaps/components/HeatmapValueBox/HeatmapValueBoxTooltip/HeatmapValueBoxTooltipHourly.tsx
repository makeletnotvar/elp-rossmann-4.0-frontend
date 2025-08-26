import { Box, Typography } from '@mui/material';
import { AccessAlarmOutlined, CalendarTodayOutlined, NotificationsActiveOutlined } from '@mui/icons-material';
import React, { memo } from 'react';

interface HeatmapValueBoxTooltipHourlyProps {
	datetime: string;
	value: number;
	includeHours?: boolean;
}

const HeatmapValueBoxTooltipHourly: React.FC<HeatmapValueBoxTooltipHourlyProps> = ({ datetime, value, includeHours }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gridGap: 3 }}>
			<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
				<CalendarTodayOutlined fontSize='inherit' style={{ marginRight: 0.15 }} />
				<Typography style={{ fontSize: '12px', marginTop: 0.2 }}>Data: </Typography>
				<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600 }}>
					{new Date(datetime).toLocaleString('pl-PL', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					})}
				</Typography>
			</Typography>
			{includeHours && (
				<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
					<AccessAlarmOutlined fontSize='inherit' style={{ marginRight: 0.15 }} />
					<Typography style={{ fontSize: '12px', marginTop: 0.2 }}>Godzina: </Typography>
					<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600 }}>
						{new Date(datetime).toLocaleString('pl-PL', {
							hour: 'numeric',
							minute: '2-digit',
						})}
					</Typography>
				</Typography>
			)}
			<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
				<NotificationsActiveOutlined fontSize='inherit' style={{ marginLeft: 0.05 }} />
				<Typography style={{ fontSize: '12px' }}>Ilość alarmów: </Typography>
				<Typography style={{ fontSize: '12px', marginTop: 0.075, fontWeight: 600 }}>{value}</Typography>
			</Typography>
		</Box>
	);
};

export default memo(HeatmapValueBoxTooltipHourly);
