import { Paper } from '@mui/material';
import AuthLayoutMessages from 'modules/auth/components/AuthLayout/AuthLayoutMessages';
import React from 'react';
import styles from './AuthLayout.module.scss';

interface AuthLayoutProps {
	children?: React.ReactNode;
	label: string;
	fetching: boolean;
	successMessage: string;
	errorMessage: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, label, fetching, successMessage, errorMessage }) => {
	return (
		<div className={styles.container}>
			<Paper className={styles.containerForm} elevation={4}>
				<div className={styles.containerTexts}>
					<img height={40} src='/images/layout/rossmann.svg' />
					<span className={styles.title1}>{label}</span>
				</div>
				{children}
				<AuthLayoutMessages {...{ fetching, successMessage, errorMessage }} />
			</Paper>
		</div>
	);
};

export default AuthLayout;
