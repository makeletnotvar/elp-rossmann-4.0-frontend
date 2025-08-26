import { getStartPageRoute } from 'modules/auth/helpers/pages';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { authActions } from 'modules/common/redux/auth';
import { useAuth } from 'modules/common/selectors/auth';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import useRouter from 'use-react-router';

let defaultPassword = '';
let defaultUsername = '';

if (import.meta.env.VITE_APP_NODE_ENV !== 'production' && import.meta.env.VITE_APP_NODE_ENV !== 'test') {
	defaultUsername = 'dev';
	defaultPassword = 'dev';
}

export const useLogin = () => {
	const dispatch = useDispatch();
	const {
		history,
		location: { search },
	} = useRouter();
	const { user, fetching, fetched, error, errorMessage, veryfing, verified } = useAuth();
	const [username, setUsername] = useState<string>(defaultUsername);
	const [password, setPassword] = useState<string>(defaultPassword);
	const [redirecting, setRedirecting] = useState<boolean>(false);

	const urlParams = queryString.parse(search);
	const successURL: string = urlParams && urlParams.back ? String(decodeURIComponent(urlParams.back as string)) : getStartPageRoute();

	const submitHandler = useCallback(
		(evt: React.FormEvent) => {
			evt.preventDefault();
			if (username && password) {
				dispatch(authActions.login.request(username, password));
			}
		},
		[username, password]
	);

	useEffect(() => {
		const isLoggedSuccess = user !== null && fetched && !error;

		if (isLoggedSuccess) {
			setRedirecting(true);
			const delay = verified ? 1 : Number(import.meta.env.VITE_APP_LOGIN_REDIRECT_DELAY || 1);
			setTimeout(() => history.push(successURL), delay);
		}
	}, [fetched, error, errorMessage]);

	return {
		username,
		password,
		setUsername,
		setPassword,
		error,
		errorMessage,
		successMessage: fetched && !error ? `auth.events.200` : ``,
		isValid: password.length > 0 && username.length > 0,
		submitHandler,
		fetching,
		redirecting,
		loggedUsername: user ? user.username : '',
		veryfing,
		verified,
	};
};
