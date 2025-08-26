import { Box, Tooltip, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { memo } from 'react';
import { BOX_SIZE } from '../../constants/layout';
import HeatmapEmptyBoxTooltip from './HeatmapEmptyBoxTooltip/HeatmapEmptyBoxTooltip';

interface HeatmapEmptyBoxProps {
	datetime?: string;
	color?: string;
	includeHours?: boolean;
}

const StyledTooltip = styled(({ className, ...props }: any) => <Tooltip {...props} classes={{ tooltip: className }} />)(() => ({
	backgroundColor: '#444',
}));

const HeatmapEmptyBox: React.FC<HeatmapEmptyBoxProps> = ({ datetime, color, includeHours }) => {
	return (
		<StyledTooltip
			TransitionComponent={Zoom}
			title={datetime ? <HeatmapEmptyBoxTooltip datetime={datetime} includeHours={includeHours} /> : ''}
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
					bgcolor: color ? color : '#ddddddA5',
					border: '1px solid #dddddd',
					borderRadius: '3px',
				}}
			/>
		</StyledTooltip>
	);
};

export default memo(HeatmapEmptyBox);
