/* eslint-disable no-mixed-spaces-and-tabs */
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Formik } from 'formik';
import { BuildingEditSelectField } from 'modules/building/components/BuildingTabs/BuildingEdit/BuildingEdit';
import ClearButton from 'modules/common/components/Buttons/ClearButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import ConfirmDialog, { useConfirm } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './DevicePointEdit.module.scss';
import DevicePointEditTypeForm from './DevicePointEditTypeForm';

interface DevicePointEditFormProps {
	point: Point;
	isNew: boolean;
	onSave: (point: Point) => void;
	onDelete: (uuid: string) => void;
}

const initialValues = {
	archive: false,
	active: false,
	unitXid: '',
};

const DevicePointEditForm: React.FC<DevicePointEditFormProps> = ({ point, isNew, onSave, onDelete }) => {
	const { isOpen, openHandler, closeHandler, confirmHandler } = useConfirm<string>(onDelete);
	const {
		history,
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid?: string }>();
	const { t } = useTranslation();

	const isNumeric = point.type === 'numeric';
	const customRender = point.customRender as NumericRender;
	const customRenderNumericMax = typeof customRender.max === 'number' ? (customRender.max === 0 ? 100 : customRender.max) : 999999;

	const mergedInitialValues = {
		...initialValues,
		...point,
		customRender: isNumeric
			? {
					...customRender,
					max: customRenderNumericMax,
			  }
			: {
					...customRender,
			  },
	};

	return (
		<Formik initialValues={mergedInitialValues} onSubmit={onSave} enableReinitialize>
			{props => {
				const { values, errors, handleSubmit, handleReset, handleChange, setFieldValue, isSubmitting } = props;

				return (
					<form onSubmit={handleSubmit} className={styles.form}>
						<div className={styles.fields}>
							<Params hideCount className={styles.params} collapsable={false}>
								<TextField
									value={values.registerName}
									id='registerName'
									placeholder={t('devices.points.register_name')}
									label={t('devices.points.register_name')}
									disabled
								/>
								<TextField
									type='number'
									value={values.registerNumber}
									id='registerNumber'
									placeholder={t('devices.points.register_number')}
									label={t('devices.points.register_number')}
									onChange={handleChange}
								/>
								<TextField
									value={values.unitXid || ''}
									id='unitXid'
									placeholder={t('devices.points.unit_xid')}
									label={t('devices.points.unit_xid')}
									onChange={handleChange}
									error={Boolean(errors.unitXid)}
								/>
							</Params>
							<Params hideCount className={styles.params} collapsable={false}>
								<TextField
									value={values.name || ''}
									style={{ width: 500 }}
									id='name'
									placeholder={t('devices.points.name')}
									label={t('devices.points.name')}
									onChange={handleChange}
								/>
								<TextField
									value={values.xid}
									id='xid'
									placeholder={t('devices.points.xid')}
									label={t('devices.points.xid')}
									onChange={evt => setFieldValue('xid', evt.target.value.toLowerCase())}
								/>
							</Params>
							<Params hideCount className={styles.params} collapsable={false}>
								<BuildingEditSelectField
									id='type'
									label='devices.points.type'
									value={values.type}
									values={['numeric', 'enum']}
									translationPath='devices.points.types'
									onChange={(value: string) => setFieldValue('type', value)}
								/>
								{values.settableRegister === true && (
									<FormControlLabel
										label={t('general.settable')}
										style={{ marginLeft: 20 }}
										control={<Checkbox id='settable' checked={values.settable === true} onChange={evt => setFieldValue('settable', evt.target.checked)} />}
									/>
								)}
							</Params>
							<Params hideCount className={styles.params} collapsable={false}>
								<DevicePointEditTypeForm render={values.customRender} setFieldValue={setFieldValue} type={values.type} />
							</Params>
							<Params hideCount className={styles.params} collapsable={false}>
								<FormControlLabel
									label={t('devices.params.active')}
									control={<Checkbox id='active' checked={values.active} onChange={evt => setFieldValue('active', evt.target.checked)} />}
								/>
							</Params>
							<Params hideCount className={styles.params} collapsable={false}>
								<FormControlLabel
									label={t('devices.params.archive')}
									control={<Checkbox id='active' checked={values.archive} onChange={evt => setFieldValue('archive', evt.target.checked)} />}
								/>
								{values.archive && values.archiveConfig && (
									<div>
										<TextField
											value={values.archiveConfig.time}
											type='number'
											id='registerArchiveNumber'
											placeholder={t('devices.points.register_number')}
											label={t('devices.points.archive_time')}
											onChange={evt => setFieldValue('archiveConfig', { ...values.archiveConfig, time: Number(evt.target.value) || 0 })}
											style={{ marginRight: 5 }}
										/>
										<TextField
											value={values.archiveConfig.change}
											type='number'
											id='registerArchiveChange'
											placeholder={t('devices.points.register_change')}
											label={t('devices.points.archive_change')}
											onChange={evt => setFieldValue('archiveConfig', { ...values.archiveConfig, change: Number(evt.target.value) || 0 })}
											style={{ width: 200 }}
										/>
									</div>
								)}
							</Params>
						</div>
						<div className={styles.actions}>
							<ClearButton onClick={() => history.push(`/device/${uuid}/points`)}>{t('general.close')}</ClearButton>
							<DeleteButton onClick={() => openHandler(point.uuid)}>{t('general.delete')}</DeleteButton>
							<ClearButton onClick={handleReset}>{t('general.clear')}</ClearButton>
							<ConfirmButton disabled={isSubmitting}>
								{t(`general.${isNew ? (isSubmitting ? 'creating' : 'create') : isSubmitting ? 'saving' : 'save'}`)}
								{isSubmitting && '...'}
							</ConfirmButton>
						</div>
						<ConfirmDialog
							title={t('devices.messages.deleting_point')}
							message={`${t('devices.messages.sure_to_delete_point')}?`}
							open={isOpen}
							onCancel={closeHandler}
							onConfirm={confirmHandler}
						/>
					</form>
				);
			}}
		</Formik>
	);
};

export default DevicePointEditForm;
