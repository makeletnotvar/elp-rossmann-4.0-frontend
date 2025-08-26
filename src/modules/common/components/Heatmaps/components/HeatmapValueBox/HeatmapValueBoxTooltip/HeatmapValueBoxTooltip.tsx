import React, { memo } from 'react';
import HeatmapValueBoxTooltipDaily from './HeatmapValueBoxTooltipDaily';
import HeatmapValueBoxTooltipHourly from './HeatmapValueBoxTooltipHourly';

interface HeatmapValueBoxTooltipProps {
	type: 'DAILY' | 'HOURLY';
	datetime: string;
	value: number;
	includeHours?: boolean;
	details?: boolean;
}

const HeatmapValueBoxTooltip: React.FC<HeatmapValueBoxTooltipProps> = ({ type, datetime, value, includeHours, details }) => {
	return type === 'DAILY' ? (
		<HeatmapValueBoxTooltipDaily datetime={datetime} value={value} details={details} />
	) : type === 'HOURLY' ? (
		<HeatmapValueBoxTooltipHourly datetime={datetime} value={value} includeHours={includeHours} />
	) : null;
};

export default memo(HeatmapValueBoxTooltip);
