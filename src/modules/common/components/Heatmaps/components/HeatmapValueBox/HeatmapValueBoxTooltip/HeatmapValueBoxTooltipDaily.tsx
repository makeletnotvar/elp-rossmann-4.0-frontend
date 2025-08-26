import { Box, Typography } from '@mui/material';
import { BarChartOutlined, CalendarTodayOutlined, NotificationsActiveOutlined } from '@mui/icons-material';
import { memo } from 'react';

interface HeatmapValueBoxTooltipDailyProps {
	datetime: string;
	value: number;
	details?: boolean;
}

const HeatmapValueBoxTooltipDaily: React.FC<HeatmapValueBoxTooltipDailyProps> = ({ datetime, value, details }) => {
	// const [searchParams] = useSearchParams();
	// const {
	//   data: dataMeters,
	//   isFetching: isFetchingMeters,
	//   isSuccess: isSuccessMeters,
	//   isError: isErrorMeters,
	// } = useApiState<GetBuildingMetersResponseDTO>('buildings', GET_BUILDING_METERS);
	// const [triggerConsumption, { data, isFetching, isSuccess, isError }] =
	//   buildingsApi.endpoints.getBuildingConsumptions.useLazyQuery();

	// useEffect(() => {
	//   if (searchParams.get('m') && details && datetime) {
	//     const date = new Date(datetime);
	//     const newDate = date.toISOString().split('T')[0];
	//     triggerConsumption({
	//       m: searchParams.get('m') as string,
	//       period: DataPeriod.CUSTOM,
	//       type: HOURLY,
	//       period_from: newDate,
	//       period_to: newDate,
	//     });
	//   }
	// }, [details, searchParams, datetime]);

	// const { newDate } = useMemo(() => {
	//   const date = new Date(datetime);
	//   const newDate = date.toISOString().split('T')[0];
	//   return { newDate };
	// }, [datetime]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gridGap: 3 }}>
			<Box sx={{ display: details ? 'flex' : 'block', justifyContent: details ? 'space-between' : 'normal', gridGap: 1 }}>
				{details && (
					<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
						<BarChartOutlined fontSize='inherit' style={{ color: details ? '#808080' : '#fff', marginRight: 0.15 }} />
						<Typography style={{ fontSize: '12px', color: details ? '#808080' : '#fff' }}>Wykres zużycia dziennego</Typography>
					</Typography>
				)}
				<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
					<CalendarTodayOutlined fontSize='inherit' style={{ color: details ? '#808080' : '#fff', marginRight: 0.15 }} />
					<Typography style={{ fontSize: '12px', color: details ? '#808080' : '#fff' }}>Data: </Typography>
					<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600, color: details ? '#808080' : '#fff' }}>
						{new Date(datetime).toLocaleString('pl-PL', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})}
					</Typography>
				</Typography>
				<Typography component='span' style={{ display: 'flex', alignItems: 'center', gridGap: 3 }}>
					<NotificationsActiveOutlined fontSize='inherit' style={{ color: details ? '#808080' : '#fff', marginRight: 0.15 }} />
					<Typography style={{ fontSize: '12px', color: details ? '#808080' : '#fff' }}>Ilość alarmów: </Typography>
					<Typography style={{ marginTop: 0.075, fontSize: '12px', fontWeight: 600, color: details ? '#808080' : '#fff' }}>{value}</Typography>
				</Typography>
			</Box>
			{/* {details && (
        <Box sx={{ width: '525px', height: '200px' }}>
          {isFetchingMeters || isFetching ? (
            <CustomProgress>
              <CircularProgress size={20} />
            </CustomProgress>
          ) : isSuccessMeters && isSuccess && dataMeters && data ? (
            <HeatmapValueBoxTooltipDailyChart
              meters={dataMeters.meters}
              metersConsumption={data.consumption}
              newDate={newDate}
            />
          ) : (
            (isErrorMeters || isError) && (
              <CustomProgress>
                <Error color="error" fontSize="large" />
              </CustomProgress>
            )
          )}
        </Box>
      )} */}
		</Box>
	);
};

export default memo(HeatmapValueBoxTooltipDaily);
