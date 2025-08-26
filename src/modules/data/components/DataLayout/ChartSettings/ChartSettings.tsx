import { CloseOutlined, ShowChartOutlined } from '@mui/icons-material';
import { Fab, Paper, Tooltip } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import cn from 'classnames';
import 'date-fns';
import { DAY_TS } from 'helpers/date';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChartSettings.module.scss';

interface ChartSettingsProps {
	onClose: () => void;
	onGenerate: () => void;
	pointsUUIDs: string[];
	fromDate: any;
	setFromDate: any;
	toDate: any;
	setToDate: any;
	days: any;
	minDate: any;
	maxDate: any;
}

const ChartSettings: React.FC<ChartSettingsProps> = ({
	onClose,
	pointsUUIDs,
	onGenerate,
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	days,
	minDate,
	maxDate,
}) => {
	const { t } = useTranslation();
	const isEmpty = pointsUUIDs.length === 0;

	const DATE_FORMAT = 'DD MMMM YYYY';

	return (
		<div className={styles.settings}>
			<Paper className={styles.form} elevation={0}>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DatePicker
						slotProps={{
							textField: {
								variant: 'standard',
								size: 'small',
							},
						}}
						label={t('data.date_from')}
						value={fromDate ? moment(fromDate) : null}
						maxDate={toDate ? moment(toDate) : undefined}
						disableFuture
						onChange={newValue => {
							if (newValue) setFromDate(newValue.valueOf());
						}}
					/>
					<DatePicker
						slotProps={{
							textField: {
								variant: 'standard',
								size: 'small',
							},
						}}
						label={t('data.date_to')}
						value={toDate ? moment(toDate) : null}
						minDate={fromDate ? moment(fromDate) : undefined}
						disableFuture
						onChange={newValue => {
							if (newValue) setToDate(newValue.valueOf());
						}}
					/>
				</LocalizationProvider>
				<div className={styles.links}>
					<DateSetShortcut label='Ostatnia doba' onChangeFromDate={setFromDate} onChangeToDate={setToDate} timeInMs={DAY_TS} />
					<DateSetShortcut label='Ostatnie 7 dni' onChangeFromDate={setFromDate} onChangeToDate={setToDate} timeInMs={DAY_TS * 7} />
					<DateSetShortcut label='Ostatnie 30 dni' onChangeFromDate={setFromDate} onChangeToDate={setToDate} timeInMs={DAY_TS * 30} />
				</div>
			</Paper>
			<Paper className={styles.actions} elevation={1}>
				<Tooltip placement='top' title={t('general.close')}>
					<Fab size='small' color='default' onClick={onClose} className={styles.close}>
						<CloseOutlined />
					</Fab>
				</Tooltip>
				<Tooltip placement='top' title={t('data.messages.generate_chart')}>
					<Fab
						disabled={isEmpty}
						size='small'
						className={cn(styles.generate, { [styles.background]: !isEmpty })}
						onClick={() => {
							onGenerate();
							onClose();
						}}
					>
						<ShowChartOutlined />
					</Fab>
				</Tooltip>
			</Paper>
		</div>
	);
};

interface DateSetShortcutProps {
	label: string;
	onChangeFromDate: any;
	onChangeToDate: any;
	timeInMs: number;
}

const DateSetShortcut: React.FC<DateSetShortcutProps> = ({ label, onChangeFromDate, onChangeToDate, timeInMs }) => {
	const clickHandler = () => {
		onChangeFromDate(new Date(Date.now() - timeInMs));
		onChangeToDate(new Date());
	};

	return (
		<a onClick={clickHandler} href='#'>
			{label}
		</a>
	);
};

export default ChartSettings;
