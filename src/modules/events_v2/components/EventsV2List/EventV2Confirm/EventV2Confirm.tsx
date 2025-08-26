import { HomeOutlined, NotificationsOffOutlined } from '@mui/icons-material';
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import CustomDialog from 'modules/common/components/Dialogs/CustomDialog/CustomDialog';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import { eventsV2Actions } from 'modules/events_v2/redux/eventsV2';
import { ElpEventV2AlarmBlockCreateRequest } from 'modules/events_v2/types/eventV2-alarm-block-create-request.type';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import EventsV2Param from '../../EventsV2Param/EventsV2Param';
import stylesInstance from '../../EventsV2Param/EventsV2Param.module.scss';
import styles from './EventV2Confirm.module.scss';

interface EventV2ConfirmProps {
	event: ElpEventV2;
	onClose: () => void;
	buildingUUID?: string;
}

const EventV2Confirm: React.FC<EventV2ConfirmProps> = ({ event, onClose, buildingUUID }) => {
	const { t } = useTranslation();
	const { history } = useRouter();
	const { building, priority } = event;
	const theme = useTheme();
	const dispatch = useDispatch();
	const mobileSize = useMediaQuery(theme.breakpoints.down('sm'));

	const [checked, setChecked] = useState(false);

	const submitHandler = useCallback(
		async (data: ElpEventV2AlarmBlockCreateRequest) => {
			try {
				await dispatch(eventsV2Actions.confirm({ ...data }));
				history.push(buildingUUID ? `/building/${buildingUUID}/events-v2/confirmed?F_building=${buildingUUID}` : '/events-v2/confirmed');
			} catch (error) {
				//
			}
		},
		[dispatch, history, buildingUUID]
	);

	const deviceUUID = event.device ? event.device.uuid : '';

	const INITIAL_VALUES: ElpEventV2AlarmBlockCreateRequest = {
		deviceUUID: deviceUUID,
		name: event.name,
		code: event.code,
		type: 'OFF',
		time: null,
		comment: '',
	};

	return (
		<AuthDevOrAdmin>
			<Formik initialValues={INITIAL_VALUES} onSubmit={submitHandler}>
				{props => {
					const { values, handleSubmit, setFieldValue } = props;

					return (
						<CustomDialog
							open
							customTitle={
								<Box style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
									<NotificationsOffOutlined />
									<Box style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
										<Typography variant='h6' style={{ fontSize: mobileSize ? '0.875rem' : '1.25rem', fontWeight: 400 }}>
											{t('events.confirm.addNewAlarmBlock')}
										</Typography>
									</Box>
								</Box>
							}
							maxWidth='md'
							onClose={onClose}
							dialogActions={
								<>
									<ConfirmButton
										onClick={() => {
											onClose();
											submitHandler(values);
										}}
									>
										{t('general.add')}
									</ConfirmButton>
								</>
							}
						>
							<form onSubmit={handleSubmit}>
								<h4 className={stylesInstance.instanceHeader}>
									<HomeOutlined fontSize='inherit' style={{ marginRight: 2 }} />
									{t('events.params.info')}
								</h4>
								<div className={stylesInstance.instanceContainer}>
									<EventsV2Param fullWidth label={t('events.params.name')} value={event.name} />
								</div>
								<div className={stylesInstance.instanceContainer}>
									<EventsV2Param label={t('events.params.building')} value={building.name} />
									<EventsV2Param label={t('events.params.priority')} value={capitalize(t(`events.params.priority_values.${priority}`))} />
								</div>
								<h4 className={stylesInstance.instanceHeader}>
									<NotificationsOffOutlined fontSize='inherit' style={{ marginRight: 2 }} />
									{t('events.params.alarmBlock')}
								</h4>
								<div className={stylesInstance.instanceContainer} style={{ flexDirection: 'column' }}>
									<FormControl component='fieldset' className={styles.formControl}>
										<FormLabel className={styles.radioGroupLabel}>{t('events.params.reason')}</FormLabel>
										<RadioGroup
											name='Powód'
											value={values.type}
											onChange={(event: any) => {
												setFieldValue('type', event.currentTarget.value);
											}}
											style={{ flexDirection: 'row' }}
										>
											<FormControlLabel
												value='OFF'
												control={<Radio size='small' style={{ marginRight: '-3px' }} />}
												label={t('events.params.reason_type_values.OFF')}
											/>
											<FormControlLabel
												value='WAITING'
												control={<Radio size='small' style={{ marginRight: '-3px' }} />}
												label={t('events.params.reason_type_values.WAITING')}
											/>
										</RadioGroup>
									</FormControl>
									<div style={{ display: 'flex' }}>
										<FormControlLabel
											control={
												<Checkbox
													checked={checked}
													onChange={evt => {
														setChecked(evt.target.checked);
														if (!evt.target.checked) {
															setFieldValue('time', null);
														}
													}}
												/>
											}
											label={t('events.params.enableStopTime')}
										/>
										<TextField
											disabled={!checked}
											className={styles.paramTime}
											type='number'
											label={t('events.params.stopTime')}
											placeholder={t('events.params.stopTime')}
											value={values.time}
											onChange={(event: any) => {
												const value = parseInt(event.currentTarget.value, 10);
												setFieldValue('time', value);
											}}
											variant='standard'
											InputLabelProps={{
												shrink: true,
											}}
											InputProps={{
												style: { color: values.time ? '' : '#bbb' },
											}}
										/>
									</div>
									<TextField
										className={styles.comment}
										type='text'
										label={t('events.params.comment')}
										placeholder={t('events.params.writeComment')}
										multiline
										maxRows={4}
										minRows={4}
										value={values.comment}
										onChange={(event: any) => {
											setFieldValue('comment', event.currentTarget.value);
										}}
										variant='standard'
										InputLabelProps={{
											shrink: true,
										}}
										InputProps={{
											style: { color: values.comment ? '' : '#bbb' },
										}}
									/>
								</div>
							</form>
						</CustomDialog>
					);
				}}
			</Formik>
		</AuthDevOrAdmin>
	);
};

export default EventV2Confirm;
