import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import styles from './AuthApp.module.scss';
import LoginBox from './components/LoginBox/LoginBox';

interface StartAppProps {}

const AuthApp: React.FC<StartAppProps> = () => {
	useAuth();

	return (
		<div className={styles.container}>
			<LoginBox />
		</div>
	);
};

export default AuthApp;
