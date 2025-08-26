import { Checkbox, FormControlLabel } from '@mui/material';
import { Formik, FormikProps } from 'formik';
import ClearButton from 'modules/common/components/Buttons/ClearButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import { StyledTextField } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import Params from 'modules/common/components/Params/Params';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import DeviceEditBuildingParam from 'modules/device/components/DeviceTabs/DeviceEdit/DeviceEditBuildingParam';
import deviceValidationSchema from 'modules/device/components/DeviceTabs/DeviceEdit/deviceValidationSchema';
import { useDevice } from 'modules/device/containers/DeviceContainerHooks';
import { deviceActions } from 'modules/device/redux/device';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './DeviceEdit.module.scss';

interface DeviceEditProps {
	device: Device & Partial<DeviceDetails>;
	isNew?: boolean;
}

const DeviceEdit: React.FC<DeviceEditProps> = ({ device, isNew }) => {
	const { t } = useTranslation();
	const { history } = useRouter();
	const dispatch = useDispatch();
	const { fetching } = useDevice();
	const { closeConfirm, openConfirm, isConfirm } = useConfirmDialog();

	// Common, generated props based on param name
	const textFieldProps = useCallback((param: keyof Device, props: FormikProps<Device>) => {
		const { values, handleChange, errors, touched } = props;
		return {
			id: param,
			value: values[param],
			placeholder: t(`devices.params.${param}`),
			label: t(`devices.params.${param}`),
			onChange: handleChange,
			helperText: errors[param] && touched[param] ? t(errors[param] as string) : null,
			error: Boolean(errors[param] && touched[param]),
		};
	}, []);

	const submitHandler = useCallback(
		(values: any, { setSubmitting }: any) => {
			const action = isNew ? deviceActions.add : deviceActions.update;

			dispatch(action({ device: values }))
				.then((device: Device) => {
					setSubmitting(false);
					isNew && history.push(`/device/${device.uuid}/info`);
				})
				.catch(() => {
					setSubmitting(false);
				});
		},
		[device, isNew, fetching]
	);

	const confirmedDeleteHandler = useCallback(() => {
		closeConfirm();
		dispatch(deviceActions.remove({ uuid: device.uuid })).then(() => {
			history.push(`/devices`);
		});
	}, [device]);

	return (
		<div style={{ padding: 10 }}>
			<Formik initialValues={device || {}} onSubmit={submitHandler} validationSchema={deviceValidationSchema} enableReinitialize>
				{props => {
					const { values, touched, errors, isValid, handleSubmit, handleReset, handleChange, setFieldValue, isSubmitting } = props;
					return (
						<form onSubmit={handleSubmit}>
							<Params title={t('buildings.identity')} hideCount collapsable={false}>
								<StyledTextField
									data-testid='device-code-input'
									value={values.code}
									disabled
									placeholder={t('devices.params.code')}
									label={t('devices.params.code')}
								/>
							</Params>
							<Params title='Informacje' hideCount collapsable={false}>
								<StyledTextField data-testid='device-name-input' {...textFieldProps('name', props)} />
								<StyledTextField data-testid='device-description-input' {...textFieldProps('description', props)} />
							</Params>
							<Params title='Inne' hideCount collapsable={false}>
								<StyledTextField data-testid='device-remoteIpAddress-input' {...textFieldProps('remoteIpAddress', props)} />
								<FormControlLabel
									label={t('devices.params.active')}
									control={
										<Checkbox
											data-testid='device-active-checkbox'
											checked={values.active}
											onChange={(input, checked) => setFieldValue('active', checked)}
											color='primary'
										/>
									}
								/>
							</Params>
							<DeviceEditBuildingParam buildingRef={values.building} onChange={ob => setFieldValue('building', ob)} />
							<div className={styles.actions}>
								<DeleteButton onClick={openConfirm} disabled={isNew}>
									{t('general.delete')}
								</DeleteButton>
								<ClearButton onClick={handleReset}>{t('general.clear')}</ClearButton>
								<ConfirmButton testId='device-save-button' disabled={!isValid || isSubmitting}>
									{t(`general.${isNew ? (isSubmitting ? 'creating' : 'create') : isSubmitting ? 'saving' : 'save'}`)}
									{isSubmitting && '...'}
								</ConfirmButton>
							</div>
							<ConfirmDialog
								title={t('devices.messages.deleting_device')}
								message={`${t('devices.messages.sure_to_delete_device')}?`}
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

export default DeviceEdit;
