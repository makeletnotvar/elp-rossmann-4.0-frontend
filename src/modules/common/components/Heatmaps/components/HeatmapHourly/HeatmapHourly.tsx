import { Box } from '@mui/material';
import { nArray } from 'helpers/data';
import Loader from 'modules/common/components/Loaders/Loader';
import React, { memo, useMemo } from 'react';
import { BOX_MARGIN, BOX_SIZE } from '../../constants/layout';
import { getHourlyValue } from '../../helpers/data';
import { generateDateHourly } from '../../helpers/date';
import { useHeatmapData } from '../../hooks/useHeatmapData';
import HeatmapColumnHeader from '../HeatmapColumnHeader/HeatmapColumnHeader';
import HeatmapEmptyBox from '../HeatmapEmptyBox/HeatmapEmptyBox';
import HeatmapRowHeader from '../HeatmapRowHeader/HeatmapRowHeader';
import HeatmapValueBox from '../HeatmapValueBox/HeatmapValueBox';

interface HeatmapHourlyProps {
	data: [string, number][];
	type: 'HOURLY';
	year: number;
	month: number;
	rowHeaders: string[];
	columnHeaders: string[];
	minValue?: number;
	maxValue?: number;
	status: { isSuccess: boolean; isFetching: boolean; isError: boolean };
}

const HeatmapHourly: React.FC<HeatmapHourlyProps> = ({ data, type, year, month, rowHeaders, columnHeaders, minValue, maxValue, status }) => {
	const { getPointColor } = useHeatmapData({ data: status.isFetching ? [] : data, minValue, maxValue });
	const daysInMonthCount = new Date(year, month, 0).getDate();
	const hoursInMonthCount = 24 * daysInMonthCount;

	const heatmapItems = useMemo(() => {
		return nArray(hoursInMonthCount).map(day => {
			const date = generateDateHourly(year, month, 1, day);
			const hourlyValue = getHourlyValue(status.isFetching ? [] : data, date);

			return hourlyValue ? (
				<HeatmapValueBox
					key={`${hourlyValue[0]}-${hourlyValue[1]}`}
					type={type}
					datetime={hourlyValue[0]}
					value={hourlyValue[1]}
					getPointColor={getPointColor}
					includeHours
				/>
			) : (
				<HeatmapEmptyBox key={day} datetime={date} includeHours />
			);
		});
	}, [year, month, hoursInMonthCount, data, status.isFetching, type]);

	return (
		<Box
			sx={{
				height: 'calc(100%)',
				maxHeight: 'calc(100%)',
				maxWidth: '100%',
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
			}}
		>
			{status.isFetching && (
				<Box sx={{ position: 'absolute', bgcolor: 'rgba(80,80,80, 0.1)', width: '100%', height: '100%', zIndex: 2 }}>
					<Loader />
				</Box>
			)}
			<Box sx={{ position: 'fixed', bgcolor: '#fff', width: '55px', height: '35px', zIndex: 1 }}></Box>
			<HeatmapColumnHeader type={type} columnHeaders={columnHeaders} />
			<Box sx={{ display: 'flex', minWidth: '900px' }}>
				<HeatmapRowHeader rowHeaders={rowHeaders} />
				<Box style={{ display: 'flex', flexFlow: 'column wrap', maxHeight: (BOX_SIZE + 6 * BOX_MARGIN) * 24 }}>{heatmapItems}</Box>
				{/* <HeatmapRowSummary data={status.isFetching ? [] : data} type={type} rowHeaders={rowHeaders} /> */}
			</Box>
		</Box>
	);
};

export default memo(HeatmapHourly);
