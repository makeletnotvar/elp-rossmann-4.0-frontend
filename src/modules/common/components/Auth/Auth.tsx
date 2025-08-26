import { ADMIN, DEV, USER } from 'constants/user';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
// const styles = require("./Auth.scss");

interface AuthProps {
	children: React.ReactNode;
	type?: UserType | UserType[];
}

interface AuthDevProps {
	children: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children, type }) => {
	const { user } = useAuth();
	const types: UserType[] = type ? (type instanceof Array ? type : [type]) : [];

	const isAuthorized = user && user.type && types.includes(user.type);

	return <>{isAuthorized && <>{children}</>}</>;
};

export const AuthDev: React.FC<AuthDevProps> = ({ children }) => {
	return <Auth type={DEV}>{children}</Auth>;
};

export const AuthAdmin: React.FC<AuthDevProps> = ({ children }) => {
	return <Auth type={ADMIN}>{children}</Auth>;
};

export const AuthUser: React.FC<AuthDevProps> = ({ children }) => {
	return <Auth type={USER}>{children}</Auth>;
};

export const AuthDevOrAdmin: React.FC<AuthDevProps> = ({ children }) => {
	return <Auth type={[DEV, ADMIN]}>{children}</Auth>;
};

export default Auth;
