import { Fab, IconButton, TextField, Tooltip } from '@mui/material';
import { AddOutlined, CloseOutlined, FormatListBulletedOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { Formik } from 'formik';
import { t } from 'i18next';
import { buildingUnitsActions } from 'modules/building/redux/buildingUnits';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useAuth } from 'modules/common/selectors/auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingUnitsEditor.module.scss';
import BuildingUnitsEditorTextField from './BuildingUnitsEditorTextField';

const getDynamicColumns = (updateSingleParam: (paramIndex: number, target: 'name' | 'value', inputValue: string) => void): SuperTableDataColumns => ({
	param: {
		label: t('buildings.units.name'),
		custom: ({ value, index }) => (
			<BuildingUnitsEditorTextField
				initialValue={value}
				placeholder={t('buildings.units.name')}
				target='name'
				index={index}
				updateSingleParam={updateSingleParam}
			/>
		),
		tdClassName: styles.param,
	},
	value: {
		label: t('buildings.units.value'),
		custom: ({ value, index }) => (
			<BuildingUnitsEditorTextField
				initialValue={value}
				placeholder={t('buildings.units.value')}
				target='value'
				index={index}
				updateSingleParam={updateSingleParam}
			/>
		),
		tdClassName: styles.value,
	},
});

interface BuildingUnitsEditorProps {
	buildingUUID: string;
	unit: Unit;
	onClose: (editedUnitXid?: string) => void;
	onRemove: (xid: string, name: string) => void;
}

const EMPTY_PARAM: UnitParam = {
	param: t('buildings.units.new_param'),
	value: '',
};

const BuildingUnitsEditor: React.FC<BuildingUnitsEditorProps> = ({ buildingUUID, unit, onClose, onRemove }) => {
	const { user } = useAuth();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const submitHandler = async (nextUnit: Unit) => {
		const response = await dispatch(buildingUnitsActions.update.request(buildingUUID, unit.xid, nextUnit));
		if (response.xid) {
			onClose(response.xid);
		}
	};

	return (
		<Formik initialValues={unit || {}} onSubmit={submitHandler}>
			{props => {
				const { values, handleSubmit, setFieldValue } = props;

				const addParamHandler = () => {
					const nextParams: UnitParam[] = [...(values?.params || []), EMPTY_PARAM];
					setFieldValue('params', nextParams);
				};

				const lastAddedParamHasDefaultLabel =
					(values?.params || []).length > 0 && (values?.params || [])[(values?.params || []).length - 1].param === EMPTY_PARAM.param;
				const isAddButtonDisabled = lastAddedParamHasDefaultLabel;

				const updateSingleParam = (paramIndex: number, target: 'name' | 'value', inputValue: string) => {
					const nextParams: UnitParam[] = (values?.params || []).map(({ param, value }, index) => {
						if (paramIndex === index) {
							const nextParamName = target === 'name' ? inputValue : param;
							const nextValue = target === 'value' ? inputValue : value;
							return {
								param: nextParamName,
								value: nextValue,
							};
						} else {
							return { param, value };
						}
					});
					setFieldValue('params', nextParams);
				};

				const removeSingleParam = (index: number) => {
					const nextParams = (values?.params || []).filter((_, i) => i !== index);
					setFieldValue('params', nextParams);
				};

				return (
					<form onSubmit={handleSubmit} style={{ height: '100%' }}>
						<AuthDev>
							<div className={styles.header}>
								<div style={{ display: 'flex', gap: 10 }}>
									<TextField
										data-testid='building-units-name-input'
										label={t('buildings.units.name')}
										InputLabelProps={{
											shrink: true,
										}}
										type='text'
										value={values.name}
										onChange={evt => setFieldValue('name', evt.target.value)}
										placeholder={t('buildings.units.name')}
									/>
									<TextField
										data-testid='building-units-xid-input'
										label='Xid'
										InputLabelProps={{
											shrink: true,
										}}
										type='text'
										value={values.xid}
										onChange={evt => setFieldValue('xid', evt.target.value)}
										placeholder='Xid'
									/>
								</div>
							</div>
						</AuthDev>
						<div className={styles.labelContainer}>
							<div className={styles.label}>
								<FormatListBulletedOutlined fontSize='inherit' />
								<span>
									{t('buildings.units.device_params')} <span style={{ opacity: 0.5 }}>({(unit?.params || []).length})</span>
								</span>
							</div>
							<Tooltip title={t('general.add')}>
								<Fab className={styles.addIconFab} aria-label='Add' onClick={addParamHandler} disabled={isAddButtonDisabled} size='small' color='primary'>
									<AddOutlined className={styles.addIcon} />
								</Fab>
							</Tooltip>
						</div>
						<div className={cn(styles.container, { [styles.disabledEditDevice]: user?.type === 'ADMIN' })}>
							<Content className={styles.content}>
								<SuperTable
									hideHeaders
									className={styles.table}
									wrapperClassName={styles.wrapper}
									paginationClassName={styles.pagination}
									data={values?.params || []}
									columns={getDynamicColumns(updateSingleParam)}
									rowActions={(_, index) => <BuildingUnitsRowActions index={index} removeSingleParam={removeSingleParam} />}
									hidePagination
								/>
							</Content>
						</div>
						<div className={styles.editActions}>
							<AuthDev>
								<DeleteButton testId='building-units-dialog-delete' size='small' onClick={() => onRemove(unit.xid, unit.name)}>
									{t('general.delete')}
								</DeleteButton>
							</AuthDev>
							<CancelButton size='small' onClick={() => onClose(unit.xid)}>
								{t('general.cancel')}
							</CancelButton>
							<ConfirmButton size='small'>{t('general.save')}</ConfirmButton>
						</div>
					</form>
				);
			}}
		</Formik>
	);
};

interface BuildingUnitsRowActionsProps {
	index: number;
	removeSingleParam: (index: number) => void;
}

const BuildingUnitsRowActions: React.FC<BuildingUnitsRowActionsProps> = ({ index, removeSingleParam }) => {
	const { t } = useTranslation();
	return (
		<div className={styles.actions}>
			<Tooltip title={t('buildings.units.delete_param')} placement='bottom'>
				<IconButton size='small' onClick={() => removeSingleParam(index)}>
					<CloseOutlined />
				</IconButton>
			</Tooltip>
		</div>
	);
};

export default BuildingUnitsEditor;
