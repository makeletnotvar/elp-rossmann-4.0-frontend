import { Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Formik, FormikProps } from 'formik';
import { escapeDiacritics } from 'helpers/text';
import buildingValidationSchema from 'modules/building/components/BuildingTabs/BuildingEdit/buildingValidationSchema';
import { initialBuilding } from 'modules/building/components/BuildingTabs/BuildingTabs';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { buildingActions } from 'modules/building/redux/building';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import ClearButton from 'modules/common/components/Buttons/ClearButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import { StyledTextField } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import Params from 'modules/common/components/Params/Params';
import provinces from 'modules/common/helpers/data/provinces';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import moment from 'moment';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingEdit.module.scss';
import BuildingEditAdministratorParam from './BuildingEditAdministratorParam';
import BuildingEditInstallationCompanyParam from './BuildingEditInstallationCompanyParam';
import BuildingEditServiceCompanyParam from './BuildingEditServiceCompanyParam';

interface BuildingEditProps {
	building: Building;
	isNew?: boolean;
}

const BuildingEdit: React.FC<BuildingEditProps> = ({ building, isNew }) => {
	const { t } = useTranslation();
	const { history } = useRouter();
	const dispatch = useDispatch();
	const { fetching } = useBuilding(isNew ? undefined : building.uuid);
	const { closeConfirm, openConfirm, isConfirm } = useConfirmDialog();
	const [coordinates, setCoordinates] = useState<string>('');

	// Common, generated props based on param name
	const textFieldProps = useCallback((param: keyof Building, props: FormikProps<Building>, type: 'text' | 'number' = 'text') => {
		const { values, handleChange, errors } = props;

		return {
			id: param,
			type: type,
			value: values[param],
			placeholder: t(`project.${param}`),
			label: t(`project.${param}`),
			onChange: handleChange,
			helperText: errors[param] ? t(errors[param] as string) : null,
			error: Boolean(errors[param]),
		};
	}, []);

	// Submit edit form
	const submitHandler = useCallback(
		(values: any, { setSubmitting }: any) => {
			const action = isNew ? buildingActions.add.request : buildingActions.update.request;

			const { additionals, ...buildingValues } = values;
			const formattedAdditionals = additionals && additionals.length > 0 ? additionals : null;

			// Forms fields need to extends initial object
			const finalBuilding = { ...initialBuilding, ...buildingValues, additionals: formattedAdditionals };

			let notification = {
				message: isNew ? 'Budynek został dodany' : 'Budynek został zaktualizowany',
				variant: 'success',
			};

			dispatch(action(finalBuilding))
				.then((building: Building) => {
					setSubmitting(false);
					dispatch(UINotificationsActions.add(notification));
					isNew && history.push(`/building/${building.uuid}/info`);
				})
				.catch((error: any) => {
					setSubmitting(false);
					notification = { message: 'Wystąpił błąd: ' + error, variant: 'error' };
					dispatch(UINotificationsActions.add(notification));
				});
		},
		[building, isNew, fetching]
	);

	const confirmedDeleteHandler = useCallback(() => {
		closeConfirm();
		dispatch(buildingActions.remove.request(building.uuid)).then(() => {
			history.push(`/buildings`);
		});
	}, [building]);

	return (
		<div style={{ padding: 10 }}>
			<Formik initialValues={building || {}} onSubmit={submitHandler} validationSchema={buildingValidationSchema} enableReinitialize>
				{props => {
					const { values, touched, errors, isValid, handleSubmit, handleReset, setFieldValue, isSubmitting, setTouched } = props;
					return (
						<form onSubmit={handleSubmit}>
							<Params title={'Identyfikacja i lokalizacja'} className={styles.params} hideCount collapsable={false}>
								<StyledTextField data-testid='building-code-input' {...textFieldProps('code', props)} />
								<StyledTextField data-testid='building-city-input' {...textFieldProps('city', props)} />
								<StyledTextField data-testid='building-address-input' {...textFieldProps('address', props)} />
								<BuildingEditSelectField
									id='province'
									label='project.province'
									testId='building-province-select'
									value={values.province as string}
									values={provinces.map(escapeDiacritics)}
									onChange={value => setFieldValue('province', value)}
									error={errors.province}
									touched={touched.province}
								/>
							</Params>
							<Params title={t('buildings.building_info')} className={styles.params} hideCount collapsable={false}>
								<StyledTextField data-testid='building-area-input' {...textFieldProps('area', props)} type='number' />
								<BuildingEditSelectField
									id='placeType'
									label='project.place_type'
									value={values.placeType as string}
									values={['', 'SHOP_CENTER', 'SMALL_SHOP_CENTER', 'DETACHED', 'RESIDENTIAL']}
									translationPath='project.type_values'
									testId='building-placeType-select'
									onChange={value => setFieldValue('placeType', value)}
									error={errors.placeType}
									touched={touched.placeType}
								/>
								<BuildingEditSelectField
									id='status'
									label='project.status'
									value={values.status as string}
									values={['', 'WORKING', 'READY', 'STOPED', 'NOT_READY']}
									translationPath='project.status_values'
									testId='building-status-select'
									onChange={value => setFieldValue('status', value)}
									error={errors.status}
									touched={touched.status}
								/>
								<FormControlLabel
									label={t('project.ready_for_all_users')}
									control={
										<Checkbox
											id='readyForAllUsers'
											data-testid='building-readyForAllUsers-checkbox'
											checked={Boolean(values.readyForAllUsers)}
											onChange={evt => setFieldValue('readyForAllUsers', evt.target.checked)}
										/>
									}
								/>
							</Params>
							<Params title='Obsługa' hideCount collapsable={false}>
								<BuildingEditInstallationCompanyParam
									installationCompany={values.installationCompany}
									onChange={ob => setFieldValue('installationCompany', ob)}
									onDelete={() => setFieldValue('installationCompany', null)}
									testId='building-installationCompany-select'
								/>
								<BuildingEditServiceCompanyParam
									serviceCompany={values.serviceCompany}
									onChange={ob => setFieldValue('serviceCompany', ob)}
									onDelete={() => setFieldValue('serviceCompany', null)}
									testId='building-serviceCompany-select'
								/>
								<BuildingEditAdministratorParam
									administrator={values.administrator}
									onChange={ob => setFieldValue('administrator', ob)}
									onDelete={() => setFieldValue('administrator', null)}
									testId='building-administrator-select'
								/>
							</Params>
							<Params title={t('buildings.details')} className={styles.params} hideCount collapsable={false}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<DatePicker
										label={t('project.deploymentDateTs')}
										value={values.deploymentDateTs && values.deploymentDateTs > 0 ? moment(values.deploymentDateTs) : null}
										onChange={newValue => setFieldValue('deploymentDateTs', newValue ? newValue.toDate().getTime() : null)}
										format='DD MMMM YYYY'
										slotProps={{
											textField: {
												id: 'deploymentDateTs',
												margin: 'normal',
												sx: { width: 200 },
												variant: 'standard',
												size: 'small',
											},
										}}
										disableFuture
									/>

									<DatePicker
										label={t('project.techDepartmentDateTs')}
										value={values.techDepartmentDateTs && values.techDepartmentDateTs > 0 ? moment(values.techDepartmentDateTs) : null}
										onChange={newValue => setFieldValue('techDepartmentDateTs', newValue ? newValue.toDate().getTime() : null)}
										format='DD MMMM YYYY'
										slotProps={{
											textField: {
												id: 'techDepartmentDateTs',
												margin: 'normal',
												sx: { width: 200 },
												variant: 'standard',
												size: 'small',
											},
										}}
										disableFuture
									/>
								</LocalizationProvider>
							</Params>
							<Params title={'Dane pomocnicze'} className={styles.params} hideCount collapsable={false}>
								<StyledTextField
									id='additionals'
									value={values.additionals ? values.additionals : undefined}
									placeholder={t(`project.additionals`)}
									label={t(`project.additionals`)}
									data-testid='building-additionals-input'
									multiline
									minRows={4}
									style={{ width: 415, overflowY: 'scroll' }}
									onChange={evt => setFieldValue('additionals', evt.target.value)}
								/>
							</Params>
							<Params title='Koordynaty' hideCount collapsable={false}>
								<AuthDev>
									<StyledTextField
										id='coordinates'
										label='Współrzędne z map'
										placeholder='Wpisz współrzędne z map'
										value={coordinates}
										onChange={evt => {
											const input = evt.target.value.trim();
											const regex = /^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/;
											const match = input.match(regex);
											if (match) {
												setCoordinates(evt.target.value);
												setFieldValue('lat', parseFloat(match[1]));
												setFieldValue('long', parseFloat(match[2]));
											}
										}}
									/>
								</AuthDev>
								<StyledTextField data-testid='building-lat-input' {...textFieldProps('lat', props, 'number')} />
								<StyledTextField data-testid='building-long-input' {...textFieldProps('long', props, 'number')} />
							</Params>
							<Divider style={{ margin: '30px 0px 30px 0px' }} />
							<Params title={t('project.powerConnection')} className={styles.params} hideCount collapsable={false}>
								<BuildingEditSelectField
									id='powerConnectionType'
									testId='building-powerConnectionType-select'
									label='project.powerConnectionType'
									value={values.powerConnectionType as string}
									values={['', 'OWN', 'TENANT']}
									translationPath='project.power_type_values'
									onChange={value => setFieldValue('powerConnectionType', value)}
								/>
								<StyledTextField data-testid='building-powerConnectionPower' {...textFieldProps('powerConnectionPower', props)} type='number' />
							</Params>
							<Params title={t('buildings.building_devices')} className={styles.params} hideCount collapsable={false}>
								<BuildingEditSelectField
									id='ventTechnical'
									testId='building-ventTechnical-select'
									label='project.vent_technical'
									value={values.ventTechnical as string}
									values={['', 'NONE', 'OWN', 'OUTSOURCE']}
									translationPath='project.vent_technical_values'
									onChange={(value: string) => setFieldValue('ventTechnical', value)}
									error={errors.ventTechnical}
									touched={touched.ventTechnical}
								/>
								<StyledTextField data-testid='building-ventBrand' {...textFieldProps('ventBrand', props)} />
								<BuildingEditSelectField
									id='heat-source'
									testId='building-heatSource-select'
									label='project.heatSource'
									value={values.heatSource as string}
									values={['', 'NONE', 'WN', 'OWN']}
									translationPath='project.heat_source_values'
									onChange={(value: string) => setFieldValue('heatSource', value)}
									error={errors.heatSource}
									touched={touched.heatSource}
								/>
								<FormControlLabel
									label={t('project.bypass')}
									control={<Checkbox id='bypass' checked={values.bypass} onChange={evt => setFieldValue('bypass', evt.target.checked)} />}
								/>
							</Params>
							<Params title={t('project.fancoils')} className={styles.params} hideCount collapsable={false}>
								<BuildingEditSelectField
									id='fancoils'
									testId='building-fancoils-select'
									label='project.fancoils'
									value={values.fancoils as string}
									values={['', 'NONE', 'HEATING', 'MULTI']}
									translationPath='project.fancoils_values'
									onChange={(value: string) => setFieldValue('fancoils', value)}
									error={errors.fancoils}
									touched={touched.fancoils}
								/>
								<StyledTextField data-testid='building-fancoilsCount' {...textFieldProps('fancoilsCount', props)} type='number' />
							</Params>
							<Params title={t('project.curtains')} className={styles.params} hideCount collapsable={false}>
								<BuildingEditSelectField
									id='curtains'
									testId='building-curtains-select'
									label='project.curtains'
									value={values.curtains as string}
									values={['', 'NONE', 'ELECTRIC', 'WATER']}
									translationPath='project.curtains_values'
									onChange={(value: string) => setFieldValue('curtains', value)}
									error={errors.curtains}
									touched={touched.curtains}
								/>
								<StyledTextField data-testid='building-curtainsCount' {...textFieldProps('curtainsCount', props)} type='number' />
							</Params>
							<Params title={t('project.ac')} className={styles.params} hideCount collapsable={false}>
								<StyledTextField data-testid='building-acBrand' {...textFieldProps('acBrand', props)} />
								<StyledTextField data-testid='building-acCount' {...textFieldProps('acCount', props)} type='number' />
							</Params>
							<Params title={t('project.hp')} className={styles.params} hideCount collapsable={false}>
								<StyledTextField data-testid='building-hpBrand' {...textFieldProps('hpBrand', props)} />
								<StyledTextField data-testid='building-hpCount' {...textFieldProps('hpCount', props)} type='number' />
							</Params>
							<div className={styles.actions}>
								<AuthDev>
									<DeleteButton testId='building-delete-button' onClick={openConfirm} disabled={isNew}>
										{t('general.delete')}
									</DeleteButton>
								</AuthDev>
								<ClearButton onClick={handleReset}>{t('general.clear')}</ClearButton>
								<ConfirmButton testId='building-save-button' disabled={!isValid || isSubmitting}>
									{t(`general.${isNew ? (isSubmitting ? 'creating' : 'create') : isSubmitting ? 'saving' : 'save'}`)}
									{isSubmitting && '...'}
								</ConfirmButton>
							</div>
							<ConfirmDialog
								title={t('buildings.messages.deleting_building')}
								message={`${t('buildings.messages.sure_to_delete_building')}?`}
								open={isConfirm}
								onCancel={closeConfirm}
								onConfirm={confirmedDeleteHandler}
							/>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

interface BuildingEditSelectFieldProps {
	value: string;
	values: string[];
	translationPath?: string;
	label: string;
	onChange: (value: string) => void;
	id: string;
	error?: any;
	touched?: any;
	disabled?: boolean;
	testId?: string;
}

export const BuildingEditSelectField: React.FC<BuildingEditSelectFieldProps> = ({
	label,
	disabled,
	value,
	values,
	onChange,
	translationPath,
	id,
	error,
	touched,
	testId,
}) => {
	const { t } = useTranslation();
	return (
		<FormControl className={styles.selectContainer}>
			<StyledTextField
				label={t(label)}
				select
				disabled={disabled}
				id={id}
				value={value}
				data-testid={testId}
				onChange={evt => onChange(evt.target.value)}
				error={error && touched}
			>
				{values.map((value: string) => (
					<MenuItem key={value} value={value} data-testid={`menu-item-${value}`}>
						{value ? (translationPath ? t(`${translationPath}.${value}`) : value) : ''}
					</MenuItem>
				))}
			</StyledTextField>
			{<FormHelperText error={error && touched}>{error && touched ? t(error) : ''}</FormHelperText>}
		</FormControl>
	);
};

export default BuildingEdit;
