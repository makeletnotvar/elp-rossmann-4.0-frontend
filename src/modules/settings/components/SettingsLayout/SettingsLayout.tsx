import AccountSettings from 'modules/settings/components/AccountSettings/AccountSettings';
import * as React from 'react';
import styles from './SettingsLayout.module.scss';

interface SettingsLayoutProps {}

const SettingsLayout: React.FC<SettingsLayoutProps> = () => {
	return (
		<div className={styles.container}>
			<AccountSettings />
		</div>
	);
};

export default SettingsLayout;
