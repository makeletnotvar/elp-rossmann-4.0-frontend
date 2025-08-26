import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import cn from 'classnames';
import { Formik } from 'formik';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import ConsumptionSelectBuilding from 'modules/consumption/components/ConsumptionSelectBuilding/ConsumptionSelectBuilding';
import { DAY, MONTH, WEEK } from 'modules/consumption/constants/periods';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConsumptionSettings.module.scss';

interface ConsumptionSettingsFormProps {
	onSubmit: any;
	values: ConsumptionDataRequestSettings & { building: string };
	extended: boolean;
	isOpenMenu: boolean;
	onOpenMenu: () => void;
}

const ConsumptionSettingsForm: React.FC<ConsumptionSettingsFormProps> = ({ onSubmit, values: currentValues, extended, isOpenMenu, onOpenMenu }) => {
	const { t } = useTranslation();

	return (
		<div className={cn(styles.formContainer, { [styles.extended]: isOpenMenu })}>
			{!extended &&
				(!isOpenMenu ? (
					<IconButton style={{ marginLeft: 'auto', padding: 0 }} onClick={onOpenMenu}>
						<ArrowBack style={{ margin: 5 }} />
					</IconButton>
				) : (
					<IconButton style={{ marginLeft: 'auto', padding: 0 }} onClick={onOpenMenu}>
						<ArrowForward style={{ margin: 5 }} />
					</IconButton>
				))}
			<Formik initialValues={currentValues} onSubmit={onSubmit} enableReinitialize>
				{props => {
					const { values, handleSubmit, handleChange, setFieldValue } = props;
					const isMonthPeriod = values.period === MONTH;

					return (
						<form onSubmit={handleSubmit} className={cn(styles.form, { [styles.extended]: isOpenMenu })}>
							<ConsumptionSelectBuilding value={values.building || ''} onChange={(value, label) => setFieldValue('building', value)} />
							<h3>{t('general.settings')}</h3>
							<FormControl className={styles.selectContainer}>
								<InputLabel htmlFor='consumption-period'>{t('data.consumption.params.period')}</InputLabel>
								<Select id='consumption-period' value={values.period} onChange={evt => setFieldValue('period', evt.target.value)}>
									<MenuItem value={MONTH}>{t('data.consumption.params.period_values.month')}</MenuItem>
									<MenuItem value={WEEK}>{t('data.consumption.params.period_values.week')}</MenuItem>
									<MenuItem value={DAY}>{t('data.consumption.params.period_values.day')}</MenuItem>
								</Select>
							</FormControl>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<>
									<DatePicker
										slotProps={{
											textField: {
												variant: 'standard',
												size: 'small',
											},
										}}
										label={t('data.date_from')}
										value={values.from ? moment(values.from) : null}
										maxDate={values.to ? moment(values.to) : undefined}
										onChange={newValue => {
											if (newValue) setFieldValue('from', newValue.valueOf());
										}}
										disableFuture
									/>
									<DatePicker
										slotProps={{
											textField: {
												variant: 'standard',
												size: 'small',
											},
										}}
										label={t('data.date_to')}
										value={values.to ? moment(values.to) : null}
										minDate={values.from ? moment(values.from) : undefined}
										onChange={newValue => {
											if (newValue) setFieldValue('to', newValue.valueOf());
										}}
										disableFuture
									/>
								</>
							</LocalizationProvider>
							{isMonthPeriod && <OffsetDateField value={values.offset} onChange={handleChange} period={values.period} />}
							<ConfirmButton color='primary' onClick={onOpenMenu} disabled={!values.building}>
								{t('general.generate')}
							</ConfirmButton>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

interface OffsetDateFieldProps {
	value: number | undefined;
	onChange: (e: unknown) => void;
	period: string | undefined;
}

const OffsetDateField: React.FC<OffsetDateFieldProps> = ({ value, onChange, period }) => {
	const { t } = useTranslation();
	return (
		<>
			<TextField
				name='offset'
				value={value}
				type='number'
				label={t('data.consumption.params.offset_message')}
				onChange={onChange}
				InputProps={{ inputProps: { min: 1, max: 31 } }}
			/>
		</>
	);
};

export default ConsumptionSettingsForm;
