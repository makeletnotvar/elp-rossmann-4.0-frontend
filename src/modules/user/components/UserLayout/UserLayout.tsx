import { PeopleOutlined } from '@mui/icons-material';
import Content from 'modules/common/components/Layout/Content/Content';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import UserMenuContainer from 'modules/user/components/UserLayout/UserMenu/UserMenuContainer';
import UserTabs from 'modules/user/components/UserTabs/UserTabs';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserLayout.module.scss';

interface UserLayoutProps {
	user: User;
	isNew: boolean;
}

const UserLayout: React.FC<UserLayoutProps> = ({ user, isNew }) => {
	const { t } = useTranslation();

	const userLabel = user.label || user.username;
	const titleLabel = isNew ? t('users.new_user') : `${t('users.user')} ${userLabel}`;

	return (
		<div className={styles.container}>
			<TitleBar label={titleLabel} icon={PeopleOutlined}></TitleBar>
			<Content className={styles.main}>
				<aside className={styles.menu}>
					<UserMenuContainer user={user} isNew={isNew} />
				</aside>
				<section className={styles.content}>
					<UserTabs user={user} />
				</section>
			</Content>
		</div>
	);
};

export default UserLayout;
