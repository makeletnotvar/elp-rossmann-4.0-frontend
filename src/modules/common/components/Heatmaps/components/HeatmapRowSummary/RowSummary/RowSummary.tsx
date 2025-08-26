/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Tooltip, Typography } from '@mui/material';
import { CalendarTodayOutlined, NotificationsActiveOutlined } from '@mui/icons-material';
import React, { memo, useCallback } from 'react';
import { HEATMAP_DEFAULT_COLORS } from '../../../constants/colors';
import { getColor } from '../../../helpers/getColor';

interface RowSummaryProps {
	rowSummaryData: {
		[k: string]: number;
	};
	type: 'DAILY' | 'HOURLY';
	datetime: string;
	value: number;
}

const DAYS_OF_WEEK = {
	pon: 'Poniedziałek',
	wto: 'Wtorek',
	śro: 'Środa',
	czw: 'Czwartek',
	pią: 'Piątek',
	sob: 'Sobota',
	nie: 'Niedziela',
};

const RowSummary: React.FC<RowSummaryProps> = ({ datetime, type, value, rowSummaryData }) => {
	const getPointRowSummaryColor = useCallback(
		(value: number) => {
			const max = Math.max(...Object.entries(rowSummaryData).map(([, value]) => value));
			return value ? getColor(HEATMAP_DEFAULT_COLORS, value, 0, max) : '#dddddd';
		},
		[rowSummaryData]
	);

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gridGap: '0.5rem',
			}}
		>
			<Box sx={{ width: '35px' }} style={{ opacity: value ? 1 : 0.5 }}>
				{Number(value).toFixed(1)}%
			</Box>
			<Tooltip
				title={
					<Box sx={{ display: 'flex', flexDirection: 'column', gridGap: 0.5 }}>
						<Typography component='span' style={{ display: 'flex', alignItems: 'center' }}>
							<CalendarTodayOutlined fontSize='inherit' style={{ marginRight: 0.15 }} />
							<Typography style={{ fontSize: '12px', marginTop: 0.2 }}>{type === 'HOURLY' ? 'Godzina: ' : 'Dzień tygodnia: '}</Typography>
							<Typography style={{ marginLeft: 0.5, marginTop: 0.075, fontSize: '14px', fontWeight: 600 }}>
								{type === 'HOURLY' ? datetime : (DAYS_OF_WEEK as any)[datetime]}
							</Typography>
						</Typography>
						<Typography component='span' style={{ display: 'flex', alignItems: 'center' }}>
							<NotificationsActiveOutlined fontSize='inherit' style={{ marginRight: 0.05 }} />
							<Typography style={{ fontSize: '12px' }}>Sumaryczna ilość alarmów: </Typography>
							<Typography style={{ marginLeft: 0.5, fontSize: '14px', marginTop: 0.075, fontWeight: 600 }}>{value}</Typography>
						</Typography>
					</Box>
				}
			>
				<Box
					sx={{
						display: 'flex',
						width: '15px',
						height: '15px',
						bgcolor: getPointRowSummaryColor(value),
					}}
					style={{ opacity: value ? 1 : 0.5 }}
				/>
			</Tooltip>
		</Box>
	);
};

export default memo(RowSummary);
