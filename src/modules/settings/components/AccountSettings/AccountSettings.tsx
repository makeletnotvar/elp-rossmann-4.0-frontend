import { TextField, Typography } from '@mui/material';
import { API } from 'api/axios';
import userAPI from 'api/endpoints/userAPI';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { useState } from 'react';
import styles from './AccountSettings.module.scss';

interface AccountSettingsProps {}

const usePasswordChange = () => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
	const [status, setStatus] = useState('');

	const isCurrentPasswordValid = currentPassword.length >= 6;
	const isNewPasswordValid = newPassword.length >= 6;
	const isNewPasswordRepeatValid = newPasswordRepeat.length >= 6 && newPassword === newPasswordRepeat;

	const isSubmitEnabled = isCurrentPasswordValid && isNewPasswordValid && isNewPasswordRepeatValid;

	const { user } = useAuth();

	const submitHandler = () => {
		const request = async () => {
			if (isSubmitEnabled) {
				setStatus('fetching');
				try {
					const response = await API.put(userAPI.changePassword(), { current: currentPassword, new: newPassword });
					setStatus('success');
				} catch (err: any) {
					setStatus('error');
				}
			}
		};
		request();
	};

	return {
		isCurrentPasswordValid,
		setCurrentPassword,
		currentPassword,
		setNewPassword,
		newPassword,
		isNewPasswordValid,
		setNewPasswordRepeat,
		newPasswordRepeat,
		isNewPasswordRepeatValid,
		submitHandler,
		isSubmitEnabled,
		status,
		user: user ? user.username : '',
	};
};

const AccountSettings: React.FC<AccountSettingsProps> = () => {
	const {
		setCurrentPassword,
		currentPassword,
		setNewPassword,
		newPassword,
		setNewPasswordRepeat,
		newPasswordRepeat,
		submitHandler,
		isSubmitEnabled,
		isCurrentPasswordValid,
		isNewPasswordRepeatValid,
		isNewPasswordValid,
		user,
		status,
	} = usePasswordChange();

	return (
		<div className={styles.account}>
			<h3>
				Zmiana hasła użytkownika
				<form className={styles.form}>
					<div>
						<TextField type='text' placeholder='Użytkownik' label='Użytkownik' value={user} disabled={true} />
					</div>
					<div>
						<TextField
							type='password'
							placeholder='Aktualne hasło'
							label='Aktualne hasło'
							value={currentPassword}
							onChange={evt => setCurrentPassword(evt.currentTarget.value)}
						/>
					</div>
					<div>
						<TextField
							type='password'
							placeholder='Nowe hasło'
							label='Nowe hasło'
							value={newPassword}
							disabled={!isCurrentPasswordValid}
							error={!isNewPasswordValid && newPassword.length > 0}
							onChange={evt => setNewPassword(evt.currentTarget.value)}
						/>
					</div>
					<div>
						<TextField
							type='password'
							placeholder='Potwórz nowe hasło'
							label='Powtórz nowe hasło'
							value={newPasswordRepeat}
							disabled={!(isCurrentPasswordValid && isNewPasswordValid)}
							error={!isNewPasswordRepeatValid && newPasswordRepeat.length > 0}
							onChange={evt => setNewPasswordRepeat(evt.currentTarget.value)}
						/>
					</div>
					<div className={styles.actions}>
						<ConfirmButton disabled={!isSubmitEnabled} onClick={submitHandler}>
							{status !== 'fetching' ? 'Zmień hasło' : 'Trwa zmiana...'}
						</ConfirmButton>
						<div className={styles.text}>
							{status === 'error' && (
								<Typography variant='subtitle1' className={styles.failure}>
									Wystąpił błąd. Spróbuj ponownie.
								</Typography>
							)}
							{status === 'success' && (
								<Typography variant='subtitle2' className={styles.success}>
									Zmieniono pomyślnie hasło.
								</Typography>
							)}
							<Typography variant='subtitle2'>Nowe hasło musi mieć minimum 6 znaków.</Typography>
						</div>
					</div>
				</form>
			</h3>
		</div>
	);
};

export default AccountSettings;
