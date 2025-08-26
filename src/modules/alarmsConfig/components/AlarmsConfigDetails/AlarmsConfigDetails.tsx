/* eslint-disable no-mixed-spaces-and-tabs */
import { CloseOutlined, WarningOutlined } from '@mui/icons-material';
import {
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	useMediaQuery,
	useTheme,
} from '@mui/material';

import { Formik, FormikProps } from 'formik';
import { useDetailedAlarmConfig } from 'modules/alarmsConfig/components/AlarmsConfigDetails/AlarmsConfigDetailsHooks';
import { alarmsConfigActions } from 'modules/alarmsConfig/redux/alarmsConfig';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import priorities from 'modules/common/helpers/data/priorities';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import queryString from 'query-string';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './AlarmsConfigDetails.module.scss';
import AlarmsConfigDetailsSchema from './AlarmsConfigDetailsSchema';

interface AlarmsConfigDetailsProps {
	isNew?: boolean;
	onClose: () => void;
}

const INITIAL_VALUES: AlarmConfig = {
	code: '',
	name: '',
	priority: 'NONE' as EventPriority,
	isBlocking: false,
	unitXid: '',
};

const AlarmsConfigDetails: React.FC<AlarmsConfigDetailsProps> = ({ isNew, onClose }) => {
	const {
		history,
		location: { search },
		match: {
			params: { code },
		},
	} = useRouter<{ code?: string }>();

	const { code: codeParam, name, priority, isBlocking, unitXid } = queryString.parse(search);
	const { alarmConfig } = useDetailedAlarmConfig(code);
	const { t } = useTranslation();
	const { closeConfirm, openConfirm, isConfirm } = useConfirmDialog();
	const dispatch = useDispatch();
	const theme = useTheme();

	const initialAlarmConfigValues =
		!isNew && alarmConfig
			? {
					code: alarmConfig.code,
					name: alarmConfig.name,
					priority: alarmConfig.priority || 'NONE',
					isBlocking: alarmConfig.isBlocking,
					unitXid: alarmConfig.unitXid,
			  }
			: {
					...INITIAL_VALUES,
					code: codeParam as string,
					name: name as string,
					priority: (priority as EventPriority) || 'NONE',
					isBlocking: isBlocking === 'true' ? true : false,
					unitXid: unitXid,
			  };

	const textFieldProps = useCallback((param: keyof AlarmConfig, props: FormikProps<AlarmConfig>) => {
		const { values, handleChange, errors, touched } = props;
		return {
			id: param,
			value: values[param],
			placeholder: t(`alarmsConfig.params.${param}`),
			label: t(`alarmsConfig.params.${param}`),
			onChange: handleChange,
			helperText: errors[param] && touched[param] ? t(errors[param] as string) : null,
			error: Boolean(errors[param] && touched[param]),
		};
	}, []);

	const confirmedDeleteHandler = useCallback(() => {
		if (code) {
			closeConfirm();
			dispatch(alarmsConfigActions.delete.request(code)).then(() => {
				history.replace(`/alarmsConfig`);
			});
		}
	}, [code]);

	const submitHandler = useCallback(
		async (data: AlarmConfig) => {
			const action = !isNew && alarmConfig && code ? alarmsConfigActions.update.request(data, code) : alarmsConfigActions.add.request(data);
			const result = await dispatch(action);
			if (result && result.status && result.status === 409) {
				return { shouldClose: false, message: result.message };
			} else {
				return { shouldClose: true };
			}
		},
		[alarmConfig, code, isNew]
	);

	return (
		<Dialog open={true} className={styles.dialog} onClose={onClose} maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>
				<WarningOutlined />
				<label>{initialAlarmConfigValues.name || 'Dodaj nowy alarm'}</label>
				<IconButton className={styles.closeButton} onClick={onClose}>
					<CloseOutlined />
				</IconButton>
			</DialogTitle>
			<Formik
				onSubmit={async (values, { setSubmitting, setFieldError }) => {
					const { shouldClose, message } = await submitHandler(values);
					setSubmitting(false);
					if (shouldClose) {
						onClose();
					} else {
						setFieldError('code', message);
					}
				}}
				initialValues={initialAlarmConfigValues}
				validationSchema={AlarmsConfigDetailsSchema}
				enableReinitialize
			>
				{props => {
					const { values, handleSubmit, setFieldValue, errors, isValid, isSubmitting } = props;

					return (
						<form className={styles.form} onSubmit={handleSubmit}>
							<DialogContent className={styles.content}>
								<TextField InputLabelProps={{ shrink: true }} fullWidth disabled={!isNew} className={styles.input} {...textFieldProps('code', props)} />
								<TextField InputLabelProps={{ shrink: true }} fullWidth className={styles.input} {...textFieldProps('name', props)} />
								<TextField InputLabelProps={{ shrink: true }} fullWidth className={styles.input} {...textFieldProps('unitXid', props)} />
								<FormControl fullWidth className={styles.selectContainer}>
									<InputLabel htmlFor='priority' error={Boolean(errors.priority)}>
										{t('alarmsConfig.params.priority')}
									</InputLabel>
									<Select
										id='priority'
										value={values.priority || 'NONE'}
										onChange={evt => setFieldValue('priority', evt.target.value)}
										error={Boolean(errors.priority)}
									>
										{priorities.map((value: string) => (
											<MenuItem key={value} value={value}>
												{t(`alarmsConfig.params.priority_values.${value}`)}
											</MenuItem>
										))}
									</Select>
									{Boolean(errors.priority) && <FormHelperText error={Boolean(errors.priority)}>{errors.priority ? t(errors.priority) : ''}</FormHelperText>}
								</FormControl>
								<FormControlLabel
									label={t('alarmsConfig.params.isBlocking')}
									control={<Checkbox id='isBlocking' checked={values.isBlocking || false} onChange={evt => setFieldValue('isBlocking', evt.target.checked)} />}
								/>
							</DialogContent>
							<DialogActions className={styles.actions}>
								<DeleteButton onClick={openConfirm} disabled={isNew}>
									{t('general.delete')}
								</DeleteButton>
								<CancelButton onClick={onClose}>{t('general.close')}</CancelButton>
								{isNew === true ? (
									<ConfirmButton disabled={codeParam && name && priority && isBlocking ? false : !isValid || isSubmitting}>Dodaj</ConfirmButton>
								) : (
									<ConfirmButton disabled={!isValid || isSubmitting}>Ok</ConfirmButton>
								)}
							</DialogActions>
							<ConfirmDialog
								title={t('alarmsConfig.messages.deleting_alarmConfig')}
								message={`${t('alarmsConfig.messages.sure_to_delete_alarmConfig')}?`}
								open={isConfirm}
								onCancel={closeConfirm}
								onConfirm={confirmedDeleteHandler}
							/>
						</form>
					);
				}}
			</Formik>
		</Dialog>
	);
};

export default AlarmsConfigDetails;
