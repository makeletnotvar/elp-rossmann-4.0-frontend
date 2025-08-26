import { HomeOutlined, NotificationsOffOutlined } from '@mui/icons-material';
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import CustomDialog from 'modules/common/components/Dialogs/CustomDialog/CustomDialog';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { ElpEventV2AlarmBlockIdentifyProps } from 'modules/events_v2/interfaces/eventV2-alarm-block-identify.interface';
import { ElpEventV2AlarmBlockInstance } from 'modules/events_v2/interfaces/eventV2-alarm-block-instance.interface';
import { alarmsBlocksActions } from 'modules/events_v2/redux/alarmsBlocks';
import { ElpEventV2AlarmBlockUpdateRequest } from 'modules/events_v2/types/eventV2-alarm-block-update-request.type';
import moment from 'moment';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EventsV2Param from '../../EventsV2Param/EventsV2Param';
import stylesInstance from '../../EventsV2Param/EventsV2Param.module.scss';
import styles from './EventV2AlarmBlockDetails.module.scss';

interface EventV2AlarmBlockDetailsProps {
	alarmblock: ElpEventV2AlarmBlockInstance;
	onClose: () => void;
	onDelete: (deleteAlarmBlock: ElpEventV2AlarmBlockIdentifyProps) => void;
}

const EventV2AlarmBlockDetails: React.FC<EventV2AlarmBlockDetailsProps> = ({ alarmblock, onClose, onDelete }) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useDispatch();
	const mobileSize = useMediaQuery(theme.breakpoints.down('sm'));

	const [checked, setChecked] = useState(Boolean(alarmblock.time));

	const submitHandler = useCallback(
		(data: ElpEventV2AlarmBlockUpdateRequest) => {
			dispatch(
				alarmsBlocksActions.update({
					...data,
					deviceUUID: alarmblock.device.uuid,
					code: alarmblock.code,
				})
			);
			onClose();
		},
		[alarmblock]
	);

	return (
		<AuthDevOrAdmin>
			<Formik
				initialValues={{
					time: alarmblock.time,
					type: alarmblock.type,
					comment: alarmblock.comment,
					code: alarmblock.code,
					deviceUUID: alarmblock.device.uuid,
					name: alarmblock.name,
				}}
				onSubmit={submitHandler}
			>
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
											{t('alarmsblocks.params.alarmBlock')}
										</Typography>
									</Box>
								</Box>
							}
							maxWidth='md'
							onClose={onClose}
							dialogActions={
								<>
									<DeleteButton onClick={() => onDelete({ deviceUUID: alarmblock.device.uuid, code: alarmblock.code })}>{t('general.delete')}</DeleteButton>

									<ConfirmButton
										onClick={() => {
											onClose();
											submitHandler(values);
										}}
									>
										{t('general.ok')}
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
									<EventsV2Param fullWidth label={t('alarmsblocks.params.name')} value={alarmblock.name} />
								</div>
								<div className={stylesInstance.instanceContainer}>
									<EventsV2Param
										label={t('alarmsblocks.params.building')}
										value={alarmblock.building && alarmblock.building.name}
										link={`/building/${alarmblock.building && alarmblock.building.uuid}/info`}
									/>
									<EventsV2Param label={t('alarmsblocks.params.isActive')} value={alarmblock.isActive ? 'Aktywny' : 'Nieaktywny'} />
								</div>
								<div className={stylesInstance.instanceContainer}>
									<EventsV2Param
										label={t('alarmsblocks.params.lastOccur')}
										value={(alarmblock.lastOccurTs as number) > 0 ? moment(alarmblock.lastOccurTs as number).format('DD:MM:YYYY HH:mm') : '-'}
									/>
									<EventsV2Param
										label={t('alarmsblocks.params.startTs')}
										value={(alarmblock.startTs as number) > 0 ? moment(alarmblock.startTs as number).format('DD:MM:YYYY HH:mm') : '-'}
									/>
									<EventsV2Param label={t('alarmsblocks.params.addedBy')} value={alarmblock.user} />
								</div>
								<h4 className={stylesInstance.instanceHeader}>
									<NotificationsOffOutlined fontSize='inherit' style={{ marginRight: 2 }} />
									{t('events.params.alarmBlock')}
								</h4>
								<div className={stylesInstance.instanceContainer} style={{ flexDirection: 'column' }}>
									<FormControl component='fieldset'>
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

export default EventV2AlarmBlockDetails;
