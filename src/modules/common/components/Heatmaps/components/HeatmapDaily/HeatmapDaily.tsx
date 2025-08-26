import { Box } from '@mui/material';
import { nArray } from 'helpers/data';
import Loader from 'modules/common/components/Loaders/Loader';
import React, { memo, useMemo, useState } from 'react';
import { BOX_MARGIN, BOX_SIZE } from '../../constants/layout';
import { getDailyValue } from '../../helpers/data';
import { generateDateDaily } from '../../helpers/date';
import { useHeatmapData } from '../../hooks/useHeatmapData';
import HeatmapColumnHeader from '../HeatmapColumnHeader/HeatmapColumnHeader';
import HeatmapEmptyBox from '../HeatmapEmptyBox/HeatmapEmptyBox';
import HeatmapRowHeader from '../HeatmapRowHeader/HeatmapRowHeader';
import HeatmapValueBox from '../HeatmapValueBox/HeatmapValueBox';

interface HeatmapDailyProps {
	data: [string, number][];
	type: 'DAILY';
	year: number;
	rowHeaders: string[];
	columnHeaders: string[];
	minValue?: number;
	maxValue?: number;
	status: { isSuccess: boolean; isFetching: boolean; isError: boolean };
}

const HeatmapDaily: React.FC<HeatmapDailyProps> = ({ data, type, year, rowHeaders, columnHeaders, minValue, maxValue, status }) => {
	const [clickedBox, setClickedBox] = useState<string | null>(null);
	const { getPointColor } = useHeatmapData({ data: status.isFetching ? [] : data, minValue, maxValue });
	const date_ = new Date(year, 0, 1);
	const firstYearDateWeekday = date_.getDay();
	const yearDaysCount = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

	const heatmapItems = useMemo(() => {
		return nArray(yearDaysCount).map(day => {
			const date = generateDateDaily(year, 0, day);
			const dailyValue = getDailyValue(status.isFetching ? [] : data, date);

			return dailyValue ? (
				<HeatmapValueBox
					key={`${dailyValue[0]}-${dailyValue[1]}`}
					type={type}
					datetime={dailyValue[0]}
					value={dailyValue[1]}
					getPointColor={getPointColor}
					clickedBox={clickedBox}
					setClickedBox={setClickedBox}
				/>
			) : (
				<HeatmapEmptyBox key={`empty-${day}`} datetime={date} />
			);
		});
	}, [year, yearDaysCount, data, status.isFetching, type, clickedBox, setClickedBox]);

	const emptyBoxes = useMemo(() => {
		if (firstYearDateWeekday > 0) {
			return nArray(firstYearDateWeekday).map(day => <HeatmapEmptyBox key={'empty' + day} color='#fff' />);
		}
		return [];
	}, [firstYearDateWeekday]);

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
			<Box sx={{ position: 'fixed', bgcolor: '#fff', width: '48px', height: '35px', zIndex: 1 }}></Box>
			<HeatmapColumnHeader type={type} columnHeaders={columnHeaders} />
			<Box sx={{ display: 'flex', minWidth: '1488px' }}>
				<HeatmapRowHeader rowHeaders={rowHeaders} />
				<Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: (BOX_SIZE + 6 * BOX_MARGIN) * 7 }}>
					{emptyBoxes}
					{heatmapItems}
				</Box>
				{/* <HeatmapRowSummary data={status.isFetching ? [] : data} type={type} rowHeaders={rowHeaders} /> */}
			</Box>
		</Box>
	);
};

export default memo(HeatmapDaily);
