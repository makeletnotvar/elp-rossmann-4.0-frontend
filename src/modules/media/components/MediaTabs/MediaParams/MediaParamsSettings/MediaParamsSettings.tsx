import { DateRangeOutlined } from '@mui/icons-material';
import { AppBar, Badge, Chip } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import cn from 'classnames';
import { Formik } from 'formik';
import { isArray } from 'lodash';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import MediaParamsSettingsDialog from 'modules/media/components/MediaTabs/MediaParams/MediaParamsSettings/MediaParamsSettingsDialog/MediaParamsSettingsDialog';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaParamsSettings.module.scss';

interface MediaParamsSettingsProps {
	values: MediaParamsRequestSettings;
	onSubmit: (nextValues: MediaParamsRequestSettings) => void;
}

const MediaParamsSettings: React.FC<MediaParamsSettingsProps> = ({ values: currentValues, onSubmit }) => {
	const [pointsDialog, setPointsDialog] = useState<boolean>(false);
	const { t } = useTranslation();
	const DATE_FORMAT = 'DD MMMM YYYY';

	const pointsOpenHandler = (): void => {
		setPointsDialog(true);
	};

	return (
		<AppBar className={styles.appBar} position='static' elevation={0}>
			<Formik initialValues={currentValues} onSubmit={onSubmit} enableReinitialize>
				{props => {
					const { values, handleSubmit, setFieldValue } = props;
					const valuesPointsCount = values.p ? (isArray(values.p) ? values.p.length : 1) : 0;

					return (
						<form onSubmit={handleSubmit} className={cn(styles.form)}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<div style={{ display: 'flex', gap: '0.75rem' }}>
									<DatePicker
										label={t('data.date_from')}
										format={DATE_FORMAT}
										value={moment(values.fromTs)}
										minDate={moment(moment.now()).add(-1, 'year')}
										maxDate={moment(values.toTs)}
										onChange={date => {
											if (date) {
												setFieldValue('fromTs', date.clone().add(4, 'hour').toDate().getTime());
											}
										}}
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

							<Badge overlap='rectangular' badgeContent={valuesPointsCount} color='primary'>
								<ConfirmButton noSubmit onClick={pointsOpenHandler}>
									Wybierz punkty
								</ConfirmButton>
							</Badge>

							{pointsDialog && (
								<MediaParamsSettingsDialog open={pointsDialog} valuesPoints={values.p} setFieldValue={setFieldValue} onClose={() => setPointsDialog(false)} />
							)}

							<ConfirmButton className={styles.submit} disabled={valuesPointsCount === 0}>
								{t('general.generate')}
							</ConfirmButton>
						</form>
					);
				}}
			</Formik>
		</AppBar>
	);
};

interface DateSetShortcutProps {
	label: string;
	onChangeFromDate: any;
	onChangeToDate: any;
	timeInMs: number;
	disabled?: boolean;
}

export const DateSetShortcut: React.FC<DateSetShortcutProps> = ({ label, onChangeFromDate, onChangeToDate, timeInMs, disabled }) => {
	const clickHandler = () => {
		onChangeFromDate(moment(moment.now() - timeInMs).valueOf());
		onChangeToDate(moment(moment.now()).valueOf());
	};

	return (
		<Chip
			className={cn(styles.link, {
				[styles.disabledLink]: disabled ? disabled : false,
			})}
			avatar={<DateRangeOutlined style={{ width: '15px', height: '15px' }} />}
			label={label}
			onClick={disabled ? undefined : clickHandler}
			variant='outlined'
		/>
	);
};

export default MediaParamsSettings;
