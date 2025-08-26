import { VisibilityOffOutlined, VisibilityOutlined, VpnKeyOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { Formik, FormikProps } from 'formik';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { RequestStatus } from 'modules/common/hooks/useRequestStatus';
import { authActions } from 'modules/common/redux/auth';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { getPasswordValidationSchema } from 'modules/user/components/UserTabs/UserPassword/UserPasswordForm/passwordValidationSchema';
import initialPasswords from 'modules/user/constants/initialPasswords';
import { generateRandomPassword } from 'modules/user/helpers/password';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserPasswordForm.module.scss';

interface UserPasswordFormProps {
	userLabel: string;
	userType: UserType;
	isChangingMyself: boolean;
	status: RequestStatus;
	errorMessage: string;
	onSubmit: (passwords: UserPasswordChangeProps) => void;
	title?: string;
}

const UserPasswordForm: React.FC<UserPasswordFormProps> = ({ userLabel, title, userType, isChangingMyself, onSubmit, status, errorMessage }) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showRepeatedPassword, setShowRepeatedPassword] = useState<boolean>(false);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const isCurrentPasswordRequired = isChangingMyself;

	const formSubmitHandler = async (passwords: UserPasswordChangeProps, { setSubmitting, resetForm }: any) => {
		try {
			await onSubmit(passwords);
			setSubmitting(false);
		} catch (e) {
			//
		} finally {
			resetForm();

			if (isChangingMyself) {
				dispatch(
					UINotificationsActions.add({
						message: 'Hasło zostało zmienione, za chwilę zostaniesz wylogowany',
						variant: 'success',
					})
				);
				setTimeout(() => {
					dispatch(authActions.logout.request());
				}, 4000);
			} else {
				dispatch(
					UINotificationsActions.add({
						message: 'Hasło zostało zmienione ',
						variant: 'success',
					})
				);
			}
		}
	};

	const titleLabel = title || (isChangingMyself ? t('users.messages.change_self_password') : `${t('users.messages.change_password_for')} ${userLabel}`);

	return (
		<div className={styles.container}>
			<Formik initialValues={initialPasswords} onSubmit={formSubmitHandler} validationSchema={getPasswordValidationSchema(isCurrentPasswordRequired)}>
				{(props: FormikProps<Partial<UserPasswordChangeProps>>) => {
					const { values, isSubmitting, handleSubmit, setFieldValue, isValid, errors, submitForm } = props;

					const isNewPasswordDisabled = isCurrentPasswordRequired && values.currentPassword === '';
					const isRepeatPasswordDisabled = isCurrentPasswordRequired && (isNewPasswordDisabled || (values.newPassword || '').length < 8);

					const onGenerateRandomPassword = () => {
						const password = generateRandomPassword(20);
						setFieldValue('newPassword', password);
						setFieldValue('repeatPassword', password);
					};

					return (
						<>
							<form className={styles.form} onSubmit={handleSubmit}>
								<div className={styles.title}> {titleLabel} </div>
								<div className={styles.fields}>
									{isCurrentPasswordRequired && (
										<div className={styles.field}>
											<TextField
												data-testid='user-current-password'
												className={styles.input}
												type='password'
												placeholder={t('users.current_password')}
												label={t('users.current_password')}
												value={values.currentPassword}
												error={Boolean(errors.currentPassword)}
												helperText={t(errors.currentPassword || '')}
												onChange={evt => setFieldValue('currentPassword', evt.currentTarget.value)}
											/>
										</div>
									)}
									<div className={styles.field}>
										<TextField
											data-testid='user-password'
											type={showPassword ? 'text' : 'password'}
											disabled={isNewPasswordDisabled}
											className={styles.input}
											placeholder={t('users.new_password')}
											label={t('users.new_password')}
											value={values.newPassword}
											error={Boolean(errors.newPassword)}
											helperText={t(errors.newPassword || '')}
											onChange={evt => setFieldValue('newPassword', evt.currentTarget.value)}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton size='small' onClick={() => setShowPassword(!showPassword)} edge='end'>
															{showPassword ? <VisibilityOutlined fontSize='inherit' /> : <VisibilityOffOutlined fontSize='inherit' />}
														</IconButton>
													</InputAdornment>
												),
											}}
										/>
										<Tooltip title='Wygeneruj losowe hasło'>
											<IconButton style={{ marginTop: '15px' }} size='small' onClick={() => onGenerateRandomPassword()}>
												<VpnKeyOutlined />
											</IconButton>
										</Tooltip>
									</div>
									<div className={styles.field}>
										<TextField
											data-testid='user-repeat-password'
											type={showRepeatedPassword ? 'text' : 'password'}
											disabled={isRepeatPasswordDisabled}
											className={styles.input}
											placeholder={t('users.new_password_repeat')}
											label={t('users.new_password_repeat')}
											value={values.repeatPassword}
											error={Boolean(errors.repeatPassword)}
											helperText={t(errors.repeatPassword || '')}
											onChange={evt => setFieldValue('repeatPassword', evt.currentTarget.value)}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton size='small' onClick={() => setShowRepeatedPassword(!showRepeatedPassword)} edge='end'>
															{showRepeatedPassword ? <VisibilityOutlined fontSize='inherit' /> : <VisibilityOffOutlined fontSize='inherit' />}
														</IconButton>
													</InputAdornment>
												),
											}}
										/>
									</div>
								</div>
								<div className={styles.actions}>
									<ConfirmButton testId='save-user-password-button' disabled={!isValid || isSubmitting}>
										{isSubmitting ? 'Trwa zmiana...' : 'Zmień hasło'}
									</ConfirmButton>
								</div>
								<div className={styles.text}>
									{errorMessage && (
										<Typography variant='subtitle1' className={styles.failure}>
											{errorMessage}
										</Typography>
									)}
								</div>
							</form>
						</>
					);
				}}
			</Formik>
		</div>
	);
};

export default UserPasswordForm;
