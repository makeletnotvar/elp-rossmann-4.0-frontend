import { Button, FormControl, InputAdornment, TextField, Tooltip } from '@mui/material';
import { EmailOutlined, LockOutlined } from '@mui/icons-material';
import cn from 'classnames';
import AuthLayout from 'modules/auth/components/AuthLayout/AuthLayout';
import { useLogin } from 'modules/auth/components/LoginBox/LoginBoxHooks';
import Loader from 'modules/common/components/Loaders/Loader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../AuthLayout/AuthLayout.module.scss';

const LoginBox: React.FC = () => {
	const {
		username,
		password,
		setUsername,
		setPassword,
		isValid,
		error,
		successMessage = '',
		errorMessage = '',
		submitHandler,
		fetching,
		verified,
		veryfing,
	} = useLogin();

	const { t } = useTranslation();

	return verified ? null : veryfing ? (
		<Loader />
	) : (
		<AuthLayout label={t('auth.label')} fetching={fetching} successMessage={successMessage} errorMessage={errorMessage}>
			<form onSubmit={submitHandler} className={styles.form}>
				<FormControl className={styles.input}>
					<TextField
						id='login'
						data-testid='login-username'
						label={t('auth.mail')}
						placeholder={t('auth.mail')}
						className={styles.input}
						defaultValue={username}
						onChange={evt => setUsername(evt.currentTarget.value)}
						autoFocus
						required
						variant='standard'
						error={error}
						inputProps={{
							autoCapitalize: 'off',
							autoCorrect: 'off',
							spellCheck: false,
						}}
						InputLabelProps={{
							shrink: true,
							classes: {
								asterisk: styles.asterisk,
							},
							style: { textTransform: 'uppercase', fontSize: '14px' },
						}}
						InputProps={{
							disableUnderline: true,
							endAdornment: (
								<InputAdornment position='end'>
									<EmailOutlined fontSize='medium' style={{ paddingRight: 10, color: '#aaa' }} />
								</InputAdornment>
							),
						}}
					/>
				</FormControl>
				<FormControl className={styles.input}>
					<TextField
						id='password'
						data-testid='login-password'
						label={t('auth.password')}
						placeholder={t('auth.password')}
						className={styles.input}
						variant='standard'
						defaultValue={password}
						onChange={evt => setPassword(evt.currentTarget.value)}
						type='password'
						required
						error={error}
						inputProps={{
							autoCapitalize: 'off',
							autoCorrect: 'off',
							spellCheck: false,
						}}
						InputLabelProps={{
							shrink: true,
							classes: {
								asterisk: styles.asterisk,
							},
							style: { textTransform: 'uppercase', fontSize: '14px' },
						}}
						InputProps={{
							disableUnderline: true,
							endAdornment: (
								<InputAdornment position='end'>
									<LockOutlined fontSize='medium' style={{ paddingRight: 10, color: '#aaa' }} />
								</InputAdornment>
							),
						}}
					/>
				</FormControl>
				<Tooltip title={t('auth.contact_with_admin')}>
					<span className={styles.title4}>{t('auth.forgot_password')}</span>
				</Tooltip>
				<div className={styles.buttons}>
					<Button
						data-testid='login-button'
						className={cn(styles.button, styles.buttonLogin)}
						type='submit'
						variant='contained'
						disabled={!isValid || fetching}
						size='medium'
					>
						{fetching ? t('auth.veryfing') : t('auth.login')}
					</Button>
				</div>
			</form>
		</AuthLayout>
	);
};

export default LoginBox;
