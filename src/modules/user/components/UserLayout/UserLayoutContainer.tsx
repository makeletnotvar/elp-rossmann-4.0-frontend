import UserLayout from 'modules/user/components/UserLayout/UserLayout';
import initialUser from 'modules/user/constants/initialUser';
import { useUser } from 'modules/user/redux/user';
import { UserRouteProps } from 'modules/user/types/types';
import * as React from 'react';
import useRouter from 'use-react-router';

const UserLayoutContainer: React.FC = () => {
	const {
		match: {
			params: { userUUID, tab },
		},
	} = useRouter<UserRouteProps>();
	const { user, fetching } = useUser(userUUID);

	const detailedUser = tab === 'new' ? initialUser : user;

	return detailedUser && !fetching && <UserLayout isNew={tab === 'new'} user={detailedUser as User} />;
};

export default UserLayoutContainer;
