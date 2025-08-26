import { Box } from '@mui/material';
import HeatmapDaily from 'modules/common/components/Heatmaps/components/HeatmapDaily/HeatmapDaily';
import React from 'react';

interface EventV2DetailsHeatmapYearProps {
	heatmaps: EventHeatmaps[];
	currentYear: number;
	currentMonth: number;
	status: { isSuccess: boolean; isFetching: boolean; isError: boolean };
}

const EventV2DetailsHeatmapYear: React.FC<EventV2DetailsHeatmapYearProps> = ({ heatmaps, currentYear, status }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<HeatmapDaily
				type={'DAILY'}
				data={heatmaps}
				status={status}
				year={currentYear}
				columnHeaders={['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru']}
				rowHeaders={['nie', 'pon', 'wto', 'śro', 'czw', 'pią', 'sob']}
				minValue={Math.min(...heatmaps.map(heatmap => heatmap[1]))}
				maxValue={Math.max(...heatmaps.map(heatmap => heatmap[1]))}
			/>
		</Box>
	);
};

export default EventV2DetailsHeatmapYear;
