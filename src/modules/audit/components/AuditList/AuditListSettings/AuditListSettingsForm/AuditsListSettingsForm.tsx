import { AccountCircleOutlined, AppsOutlined, BubbleChartOutlined, ExpandLessOutlined, HomeOutlined } from '@mui/icons-material';
import { Checkbox, Fab, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import cn from 'classnames';
import { Formik } from 'formik';
import AuditListSettingsSelect from 'modules/audit/components/AuditList/AuditListSettings/AuditListSettingsSelect/AuditListSettingsSelect';
import { AuditEventTypeEnum } from 'modules/audit/helpers/data';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuditListRoutingPagitnationProps } from '../../AuditListHook';
import styles from '../AuditListSettings.module.scss';

interface AuditListSettingsFormProps {
	openFilters: boolean;
	setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
	currentValues: AuditListRoutingPagitnationProps;
	isActiveFields: {
		type: boolean;
		fromTs: boolean;
		toTs: boolean;
		building: boolean;
		user: boolean;
		point: boolean;
	};
	setIsActiveFields: React.Dispatch<
		React.SetStateAction<{
			type: boolean;
			fromTs: boolean;
			toTs: boolean;
			building: boolean;
			user: boolean;
			point: boolean;
		}>
	>;
	updateSettingsDataHandler: (nextValues: AuditListRoutingPagitnationProps) => void;
	dataBuildings: { uuid: string; name: string }[];
	dataUsers: { uuid: string; name: string }[];
	dataPoints: { uuid: string; name: string }[];
}

const AuditListSettingsForm: React.FC<AuditListSettingsFormProps> = ({
	openFilters,
	setOpenFilters,
	currentValues,
	isActiveFields,
	setIsActiveFields,
	updateSettingsDataHandler,
	dataBuildings,
	dataPoints,
	dataUsers,
}) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const DATE_FORMAT = 'DD-MM-YYYY';
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	return (
		<div>
			<Formik initialValues={currentValues} onSubmit={() => console.log()} enableReinitialize>
				{props => {
					const { values, handleSubmit, setFieldValue } = props;

					const onSetIsActive = (checked: boolean, field: string) => {
						if (values.type === AuditEventTypeEnum.SETPOINT || values.type === AuditEventTypeEnum.VIRTUAL_HMI_SETPOINT) {
							//
						} else {
							setIsActiveFields(prevState => ({
								...prevState,
								['building']: false,
							}));
							setIsActiveFields(prevState => ({
								...prevState,
								['point']: false,
							}));
							setFieldValue('building', null);
							setFieldValue('point', null);
						}

						if (!checked) {
							if (field === 'toTs') {
								updateSettingsDataHandler({ toTs: null as any, o: 0, s: currentValues.s });
							} else if (field === 'type') {
								setFieldValue(field, null);
								updateSettingsDataHandler({ point: null as any, building: null as any, type: null as any, o: 0, s: currentValues.s });
							} else if (field === 'building') {
								setFieldValue(field, null);
								setFieldValue('point', null);
								updateSettingsDataHandler({ point: null as any, [field]: null as any, o: 0, s: currentValues.s });
							} else {
								setFieldValue(field, null);
								updateSettingsDataHandler({ [field]: null as any, o: 0, s: currentValues.s });
							}
						} else {
							if (field === 'toTs') {
								setFieldValue(field, moment(moment.now()).add(4, 'hour').toDate().getTime());
							} else if (field === 'fromTs') {
								setFieldValue(field, moment(moment.now()).add(-7, 'days').add(4, 'hour').toDate().getTime());
							}
						}
						setIsActiveFields(prevState => ({
							...prevState,
							[field]: checked,
						}));
					};

					return (
						<form onSubmit={handleSubmit} className={cn(styles.form)}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', gap: 11.5 }}>
										<div style={{ display: 'flex', gap: 12 }}>
											<Checkbox
												size='small'
												disabled
												checked={isActiveFields.fromTs}
												onChange={(evt, checked) => onSetIsActive(checked, 'fromTs')}
												color='primary'
											/>
											<DatePicker
												slotProps={{
													textField: {
														variant: 'standard',
														size: 'small',
													},
												}}
												sx={{ width: 199 }}
												label={t('data.date_from')}
												disabled={!isActiveFields.fromTs}
												value={values.fromTs ? moment(Number(values.fromTs)) : moment(moment().add(-7, 'days').add(4, 'hour').toDate().getTime())}
												format={DATE_FORMAT}
												maxDate={moment(values.toTs)}
												onChange={value => {
													if (value && isActiveFields.fromTs) {
														setFieldValue('fromTs', moment(value).add(4, 'hour').toDate().getTime());
														updateSettingsDataHandler({ fromTs: moment(value).add(4, 'hour').toDate().getTime() });
													}
												}}
												disableFuture
											/>
										</div>
										<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
											<Checkbox size='small' checked={isActiveFields.toTs} onChange={(evt, checked) => onSetIsActive(checked, 'toTs')} color='primary' />
											<DatePicker
												slotProps={{
													textField: {
														variant: 'standard',
														size: 'small',
													},
												}}
												sx={{ width: 199 }}
												label={t('data.date_to')}
												disabled={!isActiveFields.toTs}
												value={values.toTs ? moment(Number(values.toTs)) : moment(moment().add(4, 'hour').toDate().getTime())}
												format={DATE_FORMAT}
												minDate={moment(values.fromTs)}
												onChange={value => {
													if (value && isActiveFields.toTs) {
														setFieldValue('toTs', moment(value).add(4, 'hour').toDate().getTime());
														updateSettingsDataHandler({ toTs: moment(value).add(4, 'hour').toDate().getTime() });
													}
												}}
												disableFuture
											/>
										</div>
									</div>
									<Fab color='primary' size='small' className={styles.addIconFab} onClick={() => setOpenFilters(false)}>
										<ExpandLessOutlined />
									</Fab>
								</div>
							</LocalizationProvider>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
								<Checkbox size='small' checked={isActiveFields.type} onChange={(evt, checked) => onSetIsActive(checked, 'type')} color='primary' />
								<AuditListSettingsSelect
									disabled={!isActiveFields.type}
									value={values.type || ''}
									icon={AppsOutlined}
									onChange={value => {
										updateSettingsDataHandler({ type: value, o: 0, s: currentValues.s });
										if (values.type !== AuditEventTypeEnum.SETPOINT && values.type !== AuditEventTypeEnum.VIRTUAL_HMI_SETPOINT) {
											setIsActiveFields(prevState => ({
												...prevState,
												['building']: false,
											}));
											setIsActiveFields(prevState => ({
												...prevState,
												['point']: false,
											}));
											setFieldValue('building', null);
											setFieldValue('point', null);
											updateSettingsDataHandler({ type: value, o: 0, s: currentValues.s });
										} else {
											updateSettingsDataHandler({ building: null as any, point: null as any, type: value, o: 0, s: currentValues.s });
										}
										setFieldValue('type', value);
									}}
									selectPlaceholder='Wybierz typ zdarzenia...'
									selectTitle='Wybierz typ zdarzenia'
									data={[
										{ uuid: AuditEventTypeEnum.LOGIN, name: t('audit.types.LOGIN') },
										{ uuid: AuditEventTypeEnum.SETPOINT, name: t('audit.types.SETPOINT') },
										{ uuid: AuditEventTypeEnum.VIRTUAL_HMI_SETPOINT, name: t('audit.types.VIRTUAL_HMI_SETPOINT') },
										{ uuid: AuditEventTypeEnum.VIRTUAL_HMI, name: t('audit.types.VIRTUAL_HMI') },
										{ uuid: AuditEventTypeEnum.BUILDING_UPDATE, name: t('audit.types.BUILDING_UPDATE') },
										{ uuid: AuditEventTypeEnum.EVENT_ACKNOWLEDGE, name: t('audit.types.EVENT_ACKNOWLEDGE') },
									]}
									fetched={true}
								/>
								<Checkbox size='small' checked={isActiveFields.user} onChange={(evt, checked) => onSetIsActive(checked, 'user')} color='primary' />
								<AuditListSettingsSelect
									disabled={!isActiveFields.user}
									value={values.user || ''}
									icon={AccountCircleOutlined}
									onChange={value => {
										updateSettingsDataHandler({ user: value, o: 0, s: currentValues.s });
										setFieldValue('user', value);
									}}
									selectPlaceholder='Wybierz użytkownika...'
									selectTitle='Wybierz użytkownika'
									data={dataUsers}
									fetched={true}
								/>
								{Boolean(values.type) && (values.type === AuditEventTypeEnum.SETPOINT || values.type === AuditEventTypeEnum.VIRTUAL_HMI_SETPOINT) && (
									<>
										<Checkbox size='small' checked={isActiveFields.building} onChange={(evt, checked) => onSetIsActive(checked, 'building')} color='primary' />
										<AuditListSettingsSelect
											disabled={!isActiveFields.building}
											value={values.building || ''}
											icon={HomeOutlined}
											onChange={value => {
												setFieldValue('building', value);
												updateSettingsDataHandler({ building: value, o: 0, s: currentValues.s });
											}}
											selectPlaceholder='Wybierz budynek...'
											selectTitle='Wybierz budynek'
											data={dataBuildings}
											fetched={true}
										/>
										{Boolean(values.building) && (
											<>
												<Checkbox size='small' checked={isActiveFields.point} onChange={(evt, checked) => onSetIsActive(checked, 'point')} color='primary' />
												<AuditListSettingsSelect
													disabled={!isActiveFields.point}
													value={values.point || ''}
													icon={BubbleChartOutlined}
													onChange={value => {
														setFieldValue('point', value);
														updateSettingsDataHandler({ point: value, o: 0, s: currentValues.s });
													}}
													selectPlaceholder='Wybierz punkt...'
													selectTitle='Wybierz punkt'
													data={dataPoints}
													fetched={true}
												/>
											</>
										)}
									</>
								)}
							</div>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

export default AuditListSettingsForm;
