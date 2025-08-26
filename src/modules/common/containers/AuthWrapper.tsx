import { useAuth } from 'modules/common/selectors/auth';
import React from 'react';

interface AuthWrapperProps {
	children: React.ReactNode;
}

//
// Authorization module
//
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
	const { user } = useAuth();

	const isAuthenticated = !!user;

	return <>{isAuthenticated && children}</>;
};

export default AuthWrapper;
