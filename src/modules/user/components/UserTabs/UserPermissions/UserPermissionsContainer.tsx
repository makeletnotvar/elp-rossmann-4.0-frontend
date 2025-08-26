import UserPermissions from 'modules/user/components/UserTabs/UserPermissions/UserPermissions';
import useUserPermissions from 'modules/user/hooks/useUserPermissions';
import { UserRouteProps } from 'modules/user/types/types';
import * as React from 'react';
import useRouter from 'use-react-router';

const UserPermissionsContainer: React.FC = () => {
	const {
		match: {
			params: { userUUID },
		},
	} = useRouter<UserRouteProps>();
	const { permissions, error, onAdd, onRemove } = useUserPermissions(userUUID);

	return <UserPermissions permissions={permissions} onAdd={onAdd} onRemove={onRemove} />;
};

export default UserPermissionsContainer;
