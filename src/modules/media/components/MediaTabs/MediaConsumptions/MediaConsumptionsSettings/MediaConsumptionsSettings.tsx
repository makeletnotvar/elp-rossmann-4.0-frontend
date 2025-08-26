import { AppBar, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import cn from 'classnames';
import { Formik } from 'formik';
import { YEAR_TS } from 'helpers/date';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { DAY, HOUR, MONTH, WEEK } from 'modules/media/constants/periods';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaConsumptionsSettings.module.scss';

interface MediaConsumptionsSettingsProps {
	values: MediaConsumptionsRequestSettings;
	onSubmit: (nextValues: MediaConsumptionsRequestSettings) => void;
}

const MediaConsumptionsSettings: React.FC<MediaConsumptionsSettingsProps> = ({ values: currentValues, onSubmit }) => {
	const [minDate, setMinDate] = useState<number>(Date.now() - YEAR_TS);
	const { t } = useTranslation();
	const DATE_FORMAT = 'DD MMMM YYYY';

	return (
		<AppBar className={styles.appBar} position='static' elevation={0}>
			<Formik initialValues={currentValues} onSubmit={onSubmit} enableReinitialize>
				{props => {
					const { values, handleSubmit, setFieldValue } = props;

					const handlePeriodChange = (selectedPeriod: MediaCosumptionsPeriodType) => {
						let newMinDate = moment.now() - YEAR_TS;

						switch (selectedPeriod) {
							case HOUR:
								newMinDate = moment(moment.now()).add(-7, 'day').valueOf();
								break;
							case DAY:
								newMinDate = moment(moment.now()).add(-6, 'month').valueOf();
								break;
							case WEEK:
								newMinDate = moment(moment.now()).add(-1, 'year').valueOf();
								break;
							case MONTH:
								newMinDate = moment(moment.now()).add(-1, 'year').valueOf();
								break;
							default:
								break;
						}

						setFieldValue('fromTs', moment(moment.now()).add(-1, 'day').valueOf());
						setFieldValue('period', selectedPeriod);
						setMinDate(newMinDate);
					};

					return (
						<form onSubmit={handleSubmit} className={cn(styles.form)}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<div style={{ display: 'flex', gap: '0.75rem' }}>
									<DatePicker
										label={t('data.date_from')}
										format={DATE_FORMAT}
										value={moment(values.fromTs)}
										minDate={moment(minDate)}
										maxDate={moment(values.toTs)}
										onChange={date => {
											if (date) {
												setFieldValue('fromTs', date.clone().add(4, 'hour').toDate().getTime());
											}
										}}
										disableFuture
										slotProps={{
											textField: {
												id: 'date-from',
												fullWidth: true,
												variant: 'standard',
												size: 'small',
											},
										}}
									/>

									<DatePicker
										label={t('data.date_to')}
										format={DATE_FORMAT}
										value={moment(values.toTs)}
										minDate={moment(values.fromTs)}
										maxDate={moment()}
										onChange={date => {
											if (date) {
												setFieldValue('toTs', date.clone().add(4, 'hour').toDate().getTime());
											}
										}}
										disableFuture
										slotProps={{
											textField: {
												id: 'date-to',
												fullWidth: true,
												variant: 'standard',
												size: 'small',
											},
										}}
									/>
								</div>
							</LocalizationProvider>

							<FormControl className={styles.selectContainer}>
								<InputLabel htmlFor='consumption-period'>{t('data.consumption.params.period')}</InputLabel>
								<Select id='consumption-period' value={values.period} onChange={evt => handlePeriodChange(evt.target.value)}>
									<MenuItem value={MONTH}>{t('data.consumption.params.period_values.month')}</MenuItem>
									<MenuItem value={WEEK}>{t('data.consumption.params.period_values.week')}</MenuItem>
									<MenuItem value={DAY}>{t('data.consumption.params.period_values.day')}</MenuItem>
									<MenuItem value={HOUR}>{t('data.consumption.params.period_values.hour')}</MenuItem>
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel style={{ fontSize: '12px' }} component='legend'>
									{t('media.source')}
								</FormLabel>
								<RadioGroup
									style={{
										display: 'flex',
										flexFlow: 'row nowrap',
										gap: '0.5rem',
									}}
									value={values.source}
									onChange={evt => {
										const { currentTarget } = evt;
										setFieldValue('source', (currentTarget as HTMLButtonElement).value);
									}}
								>
									<FormControlLabel style={{ height: '30px', whiteSpace: 'nowrap' }} value='TOTAL' control={<Radio size='small' />} label={t('media.sc')} />
									<FormControlLabel style={{ height: '30px', whiteSpace: 'nowrap' }} value='AC' control={<Radio size='small' />} label={t('media.ac')} />
								</RadioGroup>
							</FormControl>

							<ConfirmButton className={styles.submit}>{t('general.generate')}</ConfirmButton>
						</form>
					);
				}}
			</Formik>
		</AppBar>
	);
};

export default MediaConsumptionsSettings;
