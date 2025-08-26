import { Page } from 'config/pages';
import { ADMIN, DEV } from 'constants/user';
import { getStartPageRoute } from 'modules/auth/helpers/pages';
import Loader from 'modules/common/components/Loaders/Loader';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { appActions } from 'modules/common/redux/app';
import { AuthState } from 'modules/common/redux/auth';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route } from 'react-router-dom';
import useRouter from 'use-react-router';

interface AsyncComponentProps {
	fallback?: any;
	props?: any;
	loader: any;
	path: any;
}

export const AsyncComponent: React.FC<AsyncComponentProps> = ({ fallback = null, props = {}, loader, path }) => {
	const { t } = useTranslation();
	const Lazy = loader;
	return <Lazy {...props} />;
};
export default AsyncComponent;

interface AsyncRouteProps {
	userState: AuthState;
	path: string;
	page?: Page;
	exact?: boolean;
	props?: any;
	loader: any;
	fallback?: any;
	shouldLoad?: (() => boolean) | undefined;
	premiumOnly?: boolean;
	devOnly?: boolean;
	devOrAdminOnly?: boolean;
}

interface AuthProps extends Pick<AsyncRouteProps, 'page' | 'path' | 'userState'> {}

const useAuthRoute = ({ page, path, userState }: AuthProps) => {
	const { user, verified, veryfing, fetched, error } = userState;
	const dispatch = useDispatch();
	const isLogged = user !== null;
	const isLoginRoutePath = path === '/login';
	const isDevUserLogged = user && user.type === DEV;
	const isDevOrAdminUserLogged = user && (user.type === DEV || user.type === ADMIN);
	const pageRequireLogin = page && page.loginRequired;
	const loginRequired = pageRequireLogin && !isLogged && !isLoginRoutePath;

	useEffect(() => {
		page && dispatch(appActions.setModule(page.moduleType));
	}, [page]);

	return {
		user,
		isDevUserLogged,
		isDevOrAdminUserLogged,
		loginRequired,
		isLoginRoutePath,
		isLogged,
		verified,
		veryfing,
		fetched,
		error,
		passwordExpired: user && user.passwordExpired,
	};
};

/**
 * React-Router Route wrapper for provide authetnticated routes
 */
export const AsyncRoute: React.FC<AsyncRouteProps> = ({
	userState,
	path,
	page,
	exact,
	loader,
	fallback = null,
	props = {},
	shouldLoad: condition,
	premiumOnly,
	devOnly = false,
	devOrAdminOnly = false,
}) => {
	const { verified, veryfing, fetched, passwordExpired, isDevOrAdminUserLogged, isDevUserLogged, user } = useAuthRoute({ userState, page, path });

	const {
		location: { pathname, search },
	} = useRouter();

	const nextAuthorizedRoute = <Route {...{ path, exact }} render={() => <AsyncComponent {...{ loader, props, fallback, path }} />} />;
	const backURI = encodeURIComponent(`${pathname}${search}`);

	return (
		<>
			{user && veryfing ? (
				<Loader />
			) : user && (verified || fetched) ? (
				passwordExpired ? (
					<Redirect from={path} exact={exact} to={`/password-expired`} />
				) : devOnly && isDevUserLogged ? (
					nextAuthorizedRoute
				) : devOrAdminOnly && isDevOrAdminUserLogged ? (
					nextAuthorizedRoute
				) : !devOnly && !devOrAdminOnly ? (
					nextAuthorizedRoute
				) : (
					<Redirect from={path} exact={exact} to={getStartPageRoute()} />
				)
			) : (
				user && <Redirect from={path} exact={exact} to={`/login?back=${backURI}`} />
			)}
		</>
	);
};
