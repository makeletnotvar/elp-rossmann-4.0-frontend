import { API } from 'api/axios';
import authAPI from 'api/endpoints/authAPI';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { clearSessionStorageUser, getSessionStorageUser } from 'modules/common/auth/storage';
import { store } from 'modules/common/containers/AppContainer';
import { appActions } from 'modules/common/redux/app';

export default function init(axiosInstance: AxiosInstance) {
	/**
	 * Token exchange and refresh middleware,
	 * in axios is called interceptor
	 */

	let isRefreshing = false;
	let failedQueue: any[] = [];

	const processQueue = (error: any, token = null) => {
		failedQueue.forEach(prom => {
			if (error) {
				prom.reject(error);
			} else {
				prom.resolve(token);
			}
		});

		failedQueue = [];
	};

	/**
	 * Middleware (called in axios as interceptor) for correct response handler.
	 * Generally
	 *
	 */
	function correctResponseHandler(response: AxiosResponse) {
		store.dispatch(appActions.processing(false));
		return response;
	}

	interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
		_retry?: boolean;
	}

	/**
	 *
	 * Main refresh token middleware
	 *
	 */
	function incorrectResponseHandler(error: AxiosError) {
		/**
		 * We get response,
		 * first of all we need to set processing flag as false in app store state.
		 */
		store.dispatch(appActions.processing(false));

		const originalRequest: AxiosRequestConfigWithRetry = error.config;
		// const isNotAuthorized = error.response && error.response.status === 401;
		const isNotRetry = !originalRequest._retry;

		const isFailedLoginRequest: boolean = Boolean(originalRequest.url && originalRequest.url.includes('auth/login'));
		const invalidApiMethodOrRequest = error.response && (error.response.status === 404 || error.response.status === 406);
		const isTokenRequest: boolean = Boolean(originalRequest.url && originalRequest.url.includes('auth/token'));
		const isFailedTokenRequest = isTokenRequest && error.response;

		if (isFailedTokenRequest || isFailedLoginRequest || invalidApiMethodOrRequest) {
			return Promise.reject(error);
		}

		if (isNotRetry) {
			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedQueue.push({ resolve, reject });
				})
					.then(token => {
						return axios(originalRequest);
					})
					.catch(err => {
						return err;
					});
			}
			originalRequest._retry = true;
			isRefreshing = true;

			return new Promise(async function (resolve, reject) {
				try {
					const response = await API.post(authAPI.refreshToken(), { username: getSessionStorageUser() });
					processQueue(null, response.data.token);
					resolve(axios(originalRequest));
				} catch (err: any) {
					clearSessionStorageUser();
					if (!isFailedLoginRequest && !window.location.href.includes('login')) {
						if (error.message !== 'token.expired') {
							window.location.href = '/login';
						}
					}
					processQueue(err, null);
					reject(err);
				} finally {
					isRefreshing = false;
				}
			});
		}

		return Promise.reject(error);
	}

	/**
	 * There is some requests where we don't need to include to store updates.
	 * It's mainly interval requests like notifications or poll.
	 *
	 */
	function isIncludedRequestURLInStoreUpdate(url: string | undefined = ''): boolean {
		let included = false;

		const IGNORED_PATH_PARTS = ['poll', 'notifications', 'token', 'registers', 'summary'];

		if (url) {
			included = !IGNORED_PATH_PARTS.some(part => url.includes(part));
		}

		return included;
	}

	/**
	 * Update request status in app/processing flag
	 * @param value
	 */
	function includeRequestStatusInStoreUpdateInterceptor(value: AxiosRequestConfig) {
		const included = isIncludedRequestURLInStoreUpdate(value.url);

		if (included) {
			store.dispatch(appActions.processing(true));
		}

		return value;
	}

	/**
	 * Bind request incerceptors to axios instance
	 */
	API.interceptors.request.use(includeRequestStatusInStoreUpdateInterceptor);

	/**
	 * Bind response incerceptors to axios instance
	 */
	API.interceptors.response.use(correctResponseHandler, incorrectResponseHandler);
}
