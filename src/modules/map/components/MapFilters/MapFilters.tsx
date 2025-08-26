import { Box, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MapFilters.module.scss';

interface MapFiltersProps {
	filterConnection: string;
	filterAlarm: string;
	filterAlarmState: number[];
	setFilterConnection: React.Dispatch<React.SetStateAction<string>>;
	setFilterAlarm: React.Dispatch<React.SetStateAction<string>>;
	setFilterAlarmState: React.Dispatch<React.SetStateAction<number[]>>;
}

const CONNECTION = [
	{ label: 'ALL', value: 'ALL' },
	{ label: 'ONLINE', value: 'ONLINE' },
	{ label: 'OFFLINE', value: 'OFFLINE' },
];

const ALARMS = [
	{ label: 'ALL', value: 'ALL' },
	{ label: 'ACTIVE', value: 'ACTIVE' },
	{ label: 'INACTIVE', value: 'INACTIVE' },
];

const ALARMS_STATES = [
	{ label: 'NONE', value: 0 },
	{ label: 'INFORMATION', value: 1 },
	{ label: 'URGENT', value: 2 },
	{ label: 'CRITICAL', value: 3 },
	{ label: 'LIFE_SAFETY', value: 4 },
];

const MapFilters: React.FC<MapFiltersProps> = ({
	filterConnection,
	filterAlarm,
	filterAlarmState,
	setFilterConnection,
	setFilterAlarm,
	setFilterAlarmState,
}) => {
	const { t } = useTranslation();

	const handleAlarmStateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setFilterAlarmState(event.target.value as number[]);
	};

	const renderSelect = (label: string, value: string, onChange: (value: any) => void, options: any[]) => (
		<TextField
			select
			label={t(label)}
			value={value}
			onChange={(e: any) => onChange(e.target.value)}
			size='small'
			slotProps={{
				inputLabel: {
					variant: 'outlined',
					sx: {
						fontSize: '12px',
					},
				},
			}}
			variant='outlined'
			className={styles.select}
			InputProps={{ style: { fontSize: '12px' } }}
			InputLabelProps={{ style: { fontSize: '12px' } }}
			SelectProps={{
				MenuProps: {
					PaperProps: { style: { maxHeight: 200 } },
				},
			}}
		>
			{options.map(option => (
				<MenuItem key={option.value} value={option.value} style={{ fontSize: '12px' }}>
					{t(`map.filters.${option.label.toLowerCase()}`)}
				</MenuItem>
			))}
		</TextField>
	);

	return (
		<Box className={styles.container}>
			{renderSelect('map.filters.name.connection', filterConnection, setFilterConnection, CONNECTION)}
			{renderSelect('map.filters.name.alarm', filterAlarm, setFilterAlarm, ALARMS)}
			{filterAlarm === 'ACTIVE' && (
				<TextField
					select
					label={t('map.filters.name.priority')}
					placeholder={t('map.filters.name.priority')}
					value={filterAlarmState}
					onChange={handleAlarmStateChange}
					size='small'
					slotProps={{
						inputLabel: {
							variant: 'outlined',
							sx: {
								fontSize: '12px',
							},
						},
					}}
					variant='outlined'
					className={styles.select2}
					InputProps={{ style: { fontSize: '12px' } }}
					InputLabelProps={{ shrink: true, style: { fontSize: '12px' } }}
					SelectProps={{
						multiple: true,
						displayEmpty: true,
						renderValue: (selected: any) =>
							selected.map((state: any) => t(`map.filters.alarms.${ALARMS_STATES.find(s => s.value === state)?.label}`)).join(', '),
						MenuProps: {
							PaperProps: { style: { maxHeight: 200 } },
						},
					}}
				>
					{ALARMS_STATES.map(alarmState => (
						<MenuItem
							key={alarmState.value}
							value={alarmState.value}
							style={{ fontSize: '12px' }}
							disabled={filterAlarmState.length === 1 && filterAlarmState[0] === alarmState.value}
						>
							{t(`map.filters.alarms.${alarmState.label}`)}
						</MenuItem>
					))}
				</TextField>
			)}
		</Box>
	);
};

export default MapFilters;
