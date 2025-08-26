/* eslint-disable indent */
import { Box } from '@mui/material';
import HeatmapHourly from 'modules/common/components/Heatmaps/components/HeatmapHourly/HeatmapHourly';
import useEventV2HeatmapSummaryMonthly from 'modules/events_v2/hooks/useEventV2HeatmapSummaryMonthly';

import React, { useMemo } from 'react';

interface EventV2DetailsHeatmapMonthProps {
	heatmaps: EventHeatmaps[];
	currentYear: number;
	currentMonth: number;
	status: { isSuccess: boolean; isFetching: boolean; isError: boolean };
}

const useEventsRange = (heatmaps: EventHeatmaps[]) => {
	const min = useMemo(() => Math.min(...heatmaps.map(([, count]) => count)), [heatmaps]);
	const max = useMemo(() => Math.min(...heatmaps.map(([, count]) => count)), [heatmaps]);

	return { min, max };
};

const EventV2DetailsHeatmapMonth: React.FC<EventV2DetailsHeatmapMonthProps> = ({ heatmaps, currentYear, currentMonth, status }) => {
	const { columnHeaders } = useEventV2HeatmapSummaryMonthly(currentYear, currentMonth);
	const { min, max } = useEventsRange(heatmaps);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<HeatmapHourly
				type={'HOURLY'}
				status={status}
				data={heatmaps}
				year={currentYear}
				month={currentMonth}
				columnHeaders={columnHeaders}
				rowHeaders={[
					'01:00',
					'02:00',
					'03:00',
					'04:00',
					'05:00',
					'06:00',
					'07:00',
					'08:00',
					'09:00',
					'10:00',
					'11:00',
					'12:00',
					'13:00',
					'14:00',
					'15:00',
					'16:00',
					'17:00',
					'18:00',
					'19:00',
					'20:00',
					'21:00',
					'22:00',
					'23:00',
					'00:00',
				]}
				minValue={min}
				maxValue={max}
			/>
		</Box>
	);
};

export default EventV2DetailsHeatmapMonth;
