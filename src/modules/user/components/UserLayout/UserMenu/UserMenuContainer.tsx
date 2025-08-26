import { LOWER_PERMISSIONS_USER } from 'constants/user';
import { useAuth } from 'modules/common/selectors/auth';
import UserMenu from 'modules/user/components/UserLayout/UserMenu/UserMenu';
import * as React from 'react';

const UserMenuContainer: React.FC<{ user: User; isNew: boolean }> = ({ user, isNew }) => {
	const { user: loggedUser } = useAuth();
	const targetUserType = user.type;
	const loggedUserType = loggedUser ? loggedUser.type : null;

	return (
		<UserMenu
			targetUserType={targetUserType || LOWER_PERMISSIONS_USER}
			loggedUserType={loggedUserType || LOWER_PERMISSIONS_USER}
			loggedUser={loggedUser}
			isNew={isNew}
		/>
	);
};

export default UserMenuContainer;
