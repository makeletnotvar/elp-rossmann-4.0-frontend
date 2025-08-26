import { CalendarTodayOutlined, QueryBuilderOutlined } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataPeriodType } from 'modules/events_v2/enums/data-period-type.enum';
import { DataPeriod } from 'modules/events_v2/enums/data-period.enum';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../EventV2Details.module.scss';
import EventV2DetailsHeatmapMonth from './EventV2DetailsHeatmapMonth';
import EventV2DetailsHeatmapYear from './EventV2DetailsHeatmapYear';

interface EventV2DetailsHeatmapsViewProps {
	heatmaps: GetEventHeatmapsDTO[];
	status: { isSuccess: boolean; isFetching: boolean; isError: boolean };
	updateSettings: React.Dispatch<
		React.SetStateAction<{
			period: DataPeriod;
			type: DataPeriodType;
			date: moment.Moment;
		}>
	>;
	settings: {
		period: DataPeriod;
		type: DataPeriodType;
		date: Moment;
	};
}

const EventV2DetailsHeatmapsView: React.FC<EventV2DetailsHeatmapsViewProps> = ({ heatmaps, status, updateSettings, settings }) => {
	const { t } = useTranslation();
	const [openMonth, setOpenMonth] = useState(false);
	const [openYear, setOpenYear] = useState(false);

	const handleDateChange = (tab: DataPeriodType, date: Moment | null) => {
		if (date) {
			updateSettings({
				type: tab,
				period: tab === 'HOURLY' ? DataPeriod.LAST_MONTH : DataPeriod.LAST_YEAR,
				date,
			});
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				position: 'sticky',
				top: -8,
				flexDirection: { xs: 'column', md: 'row' },
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				zIndex: 10,
				bgcolor: '#fff',
			}}
		>
			<TabContext value={settings.type || DataPeriodType.HOURLY}>
				<Box sx={{ height: '100%', width: '100%' }}>
					<TabList
						textColor='primary'
						style={{ minHeight: '38px', height: '38px', whiteSpace: 'nowrap', borderBottom: '1px solid #ddd' }}
						onChange={(_, tab) =>
							updateSettings({
								type: tab as DataPeriodType,
								period: tab === 'HOURLY' ? DataPeriod.LAST_MONTH : DataPeriod.LAST_YEAR,
								date: moment(),
							})
						}
					>
						<Tab
							className={styles.tab}
							style={{
								minHeight: '38px',
								height: '38px',
								textTransform: 'none',
								flexDirection: 'row',
							}}
							icon={<QueryBuilderOutlined fontSize='inherit' />}
							label={<Typography style={{ fontSize: '0.75rem' }}>Miesiąc</Typography>}
							value='HOURLY'
							disabled={status.isFetching}
						/>
						<Tab
							className={styles.tab}
							style={{
								minHeight: '38px',
								height: '38px',
								textTransform: 'none',
								flexDirection: 'row',
							}}
							icon={<CalendarTodayOutlined fontSize='inherit' />}
							label={<Typography style={{ fontSize: '0.75rem' }}>Rok</Typography>}
							value='DAILY'
							disabled={status.isFetching}
						/>

						<LocalizationProvider dateAdapter={AdapterMoment}>
							{settings.type === 'HOURLY' ? (
								<DatePicker
									views={['year', 'month']}
									openTo='month'
									label='Wybierz miesiąc'
									format='MMMM YYYY'
									value={settings.date}
									onChange={date => handleDateChange('HOURLY' as DataPeriodType, date)}
									disableFuture
									slotProps={{
										textField: {
											size: 'small',
											variant: 'standard',
											sx: {
												'*': {
													fontSize: '0.75rem',
												},
												'& .MuiPickersFilledInput-root': {
													marginTop: '7px',
												},
												'& .MuiPickersSectionList-root': {
													padding: '4px 0 2px',
												},
												fontSize: '0.75rem',
												marginLeft: 1.5,
												width: 140,
											},
										},
									}}
									open={openMonth}
									onOpen={() => setOpenMonth(true)}
									onClose={() => setOpenMonth(false)}
								/>
							) : (
								<DatePicker
									views={['year']}
									openTo='year'
									label='Wybierz rok'
									format='YYYY'
									value={settings.date}
									onChange={date => handleDateChange('DAILY' as DataPeriodType, date)}
									disableFuture
									slotProps={{
										textField: {
											size: 'small',
											variant: 'standard',
											sx: {
												'*': {
													fontSize: '0.75rem',
												},
												'& .MuiPickersFilledInput-root': {
													marginTop: '7px',
												},
												'& .MuiPickersSectionList-root': {
													padding: '4px 0 2px',
												},
												fontSize: '0.75rem',
												marginLeft: 1.5,
												width: 140,
											},
										},
									}}
									open={openYear}
									onOpen={() => setOpenYear(true)}
									onClose={() => setOpenYear(false)}
								/>
							)}
						</LocalizationProvider>
					</TabList>

					<TabPanel
						style={{
							padding: 0,
							height: 'calc(100% - 26px)',
							width: '100%',
						}}
						value='HOURLY'
					>
						{status.isSuccess && (
							<EventV2DetailsHeatmapMonth
								heatmaps={heatmaps.filter(([datetime]) => {
									const date = new Date(new Date(datetime));
									const month = settings.date.month();
									const currentMonth = date.getMonth();
									return date.getFullYear() === settings.date.year() && currentMonth === month;
								})}
								status={status}
								currentYear={settings.date.year()}
								currentMonth={settings.date.month() + 1}
							/>
						)}
					</TabPanel>

					<TabPanel
						style={{
							padding: 0,
							height: 'calc(100% - 26px)',
							width: '100%',
						}}
						value='DAILY'
					>
						{status.isSuccess && (
							<EventV2DetailsHeatmapYear
								heatmaps={heatmaps.filter(([datetime]) => {
									const date = new Date(datetime);
									return date.getFullYear() === settings.date.year();
								})}
								status={status}
								currentYear={settings.date.year()}
								currentMonth={settings.date.month()}
							/>
						)}
					</TabPanel>
				</Box>
			</TabContext>
		</Box>
	);
};

export default EventV2DetailsHeatmapsView;
