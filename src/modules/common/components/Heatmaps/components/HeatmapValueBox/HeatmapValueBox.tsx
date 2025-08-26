import { Box, Tooltip, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { memo } from 'react';
import { BOX_SIZE } from '../../constants/layout';
import HeatmapValueBoxTooltip from './HeatmapValueBoxTooltip/HeatmapValueBoxTooltip';

interface HeatmapValueBoxProps {
	type: 'DAILY' | 'HOURLY';
	datetime: string;
	value: number;
	getPointColor: (value: number) => string;
	includeHours?: boolean;
	clickedBox?: string | null;
	setClickedBox?: (clickedBox: string | null) => void;
}

interface StyledTooltipProps {
	type: 'DAILY' | 'HOURLY';
	clickedBox?: string | null;
}

const StyledTooltip = styled(({ type, clickedBox, ...props }: StyledTooltipProps & any) => <Tooltip {...props} />)(({ type, clickedBox }) => ({
	[`& .MuiTooltip-tooltip`]: {
		width: type === 'DAILY' && clickedBox ? 550 : 'auto',
		minWidth: type === 'DAILY' && clickedBox ? 550 : 'auto',
		height: type === 'DAILY' && clickedBox ? 235 : 'auto',
		minHeight: type === 'DAILY' && clickedBox ? 235 : 'auto',
		backgroundColor: type === 'DAILY' && clickedBox ? '#fff' : '#444',
		border: type === 'DAILY' && clickedBox ? '1px solid #eee' : 'none',
		boxShadow: type === 'DAILY' && clickedBox ? 'rgb(145 158 171 / 20%) 0px 0px 0px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px' : 'none',
	},
}));

const HeatmapValueBox: React.FC<HeatmapValueBoxProps> = ({ datetime, type, value, getPointColor, includeHours, clickedBox }) => {
	return (
		<StyledTooltip
			type={type}
			clickedBox={clickedBox}
			TransitionComponent={Zoom}
			title={<HeatmapValueBoxTooltip type={type} details={Boolean(clickedBox)} datetime={datetime} value={value} includeHours={includeHours} />}
			placement='bottom'
		>
			<Box
				sx={{
					m: 0.24,
					flex: 1,
					minWidth: BOX_SIZE,
					maxWidth: BOX_SIZE,
					minHeight: BOX_SIZE,
					maxHeight: BOX_SIZE,
					bgcolor: getPointColor(value) + 'A1',
					border: `1px solid ${getPointColor(value)}`,
					borderRadius: '3px',
				}}
			/>
		</StyledTooltip>
	);
};

export default memo(HeatmapValueBox);
