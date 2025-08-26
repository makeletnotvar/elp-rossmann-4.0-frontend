import useUserAuth from 'modules/user/hooks/useUserAuth';
import * as React from 'react';
// import "./UserAuth.scss";

interface UserAuthProps {
	children: React.ReactNode;
	loggedUser?: UserType; // current logged user
	targetUser: UserType; // current editing user
}

const UserAuth: React.FC<UserAuthProps> = ({ loggedUser, targetUser, children }) => {
	const authorized = useUserAuth(loggedUser || null, targetUser);
	return <>{authorized && children}</>;
};

export default UserAuth;
