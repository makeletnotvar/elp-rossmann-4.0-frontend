import { AddOutlined, AssignmentOutlined, EditOutlined, InfoOutlined, VerifiedUserOutlined, VpnKeyOutlined } from '@mui/icons-material';
import { USER } from 'constants/user';
import VertIconsList from 'modules/common/components/Lists/VertIconsList/VertIconsList';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import { USER_AUDIT, USER_EDIT, USER_INFO, USER_PASSWORD, USER_PERMISSIONS } from 'modules/user/constants/user';
import useUserMenu from 'modules/user/hooks/useUserMenu';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './UserMenu.module.scss';

interface UserMenuProps {
	targetUserType: UserType;
	loggedUserType: UserType;
	isNew: boolean;
	loggedUser: UserAuth | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ targetUserType, loggedUserType, isNew, loggedUser }) => {
	const { t } = useTranslation();
	const { history } = useRouter();
	const { clickTabHandler, activeTab, userUUID } = useUserMenu();

	// Show user permissions tab only if current logged user is Admin or Dev, and target user is User
	const showUserPermissions = loggedUserType !== USER && targetUserType === USER;

	return (
		<>
			{isNew ? (
				<VertIconsList className={styles.list} size={50}>
					<VertIconsListItem index={1} icon={AddOutlined} title={t('users.user_create')} onClick={() => {}} active={true} disabled />
				</VertIconsList>
			) : (
				<VertIconsList className={styles.list} size={50}>
					<VertIconsListItem
						index={0}
						icon={InfoOutlined}
						title={t('users.user_info')}
						onClick={() => clickTabHandler(USER_INFO)}
						active={activeTab === USER_INFO}
					/>
					<VertIconsListItem
						index={1}
						icon={EditOutlined}
						testId='edit-user-button'
						title={t('users.user_edit')}
						onClick={() => clickTabHandler(USER_EDIT)}
						active={activeTab === USER_EDIT}
					/>
					<VertIconsListItem
						index={2}
						icon={VpnKeyOutlined}
						testId='edit-user-password-button'
						title={t('users.user_password')}
						onClick={() => clickTabHandler(USER_PASSWORD)}
						active={activeTab === USER_PASSWORD}
					/>

					{/**
					 *
					 * User authorization:
					 * - audit is avaiable for admin and dev
					 * - admin can't see dev audit
					 * - permissions is only for userType=USER  (admin and dev has unlimited permissions)
					 *
					 */}
					<VertIconsListItem
						index={3}
						icon={AssignmentOutlined}
						title={t('users.user_audit')}
						onClick={() => loggedUser && history.push(`/users-audits?fromTs=${moment(moment.now()).add(-1, 'years').valueOf()}&user=${userUUID}`)}
						active={activeTab === USER_AUDIT}
						devOrAdminOnly
					/>
					{showUserPermissions && (
						<VertIconsListItem
							index={4}
							icon={VerifiedUserOutlined}
							title={t('users.user_permissions')}
							testId='edit-user-permissions-button'
							onClick={() => clickTabHandler(USER_PERMISSIONS)}
							active={activeTab === USER_PERMISSIONS}
						/>
					)}
				</VertIconsList>
			)}
		</>
	);
};

export default UserMenu;
