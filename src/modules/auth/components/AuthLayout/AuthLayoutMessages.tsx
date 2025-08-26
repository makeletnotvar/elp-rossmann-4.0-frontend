import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AuthLayout.module.scss';

interface AuthLayoutMessagesProps {
	fetching: boolean;
	successMessage: string;
	errorMessage: string;
}
const AuthLayoutMessages: React.FC<AuthLayoutMessagesProps> = ({ fetching, errorMessage, successMessage }) => {
	const { t } = useTranslation();

	return (
		<>
			{!fetching && errorMessage.length > 0 && (
				<div data-testid='login-error' className={styles.error}>
					{t(errorMessage)}
				</div>
			)}
			{!fetching && successMessage.length > 0 && (
				<div data-testid='login-success' className={styles.success}>
					{t(successMessage)}
				</div>
			)}
		</>
	);
};

export default AuthLayoutMessages;
