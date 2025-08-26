import config from 'api/config';
import axios, { AxiosRequestConfig } from 'axios';
axios.defaults.withCredentials = true;

/**
 * @TODO AX.01
 *
 * update settings
 */

const AXIOS_DEFAULT_SETTINGS: AxiosRequestConfig =
	import.meta.env.VITE_APP_NODE_ENV === 'production'
		? /* PRODUCTION CONFIG */
		  {
				baseURL: config.URL,
				// mode: 'no-cors', // no-cors, cors, *same-originp
				// cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				// credentials: 'same-origin', // include, *same-origin, omit
				headers: {
					'Content-Type': 'application/json',
					// 'Access-Control-Allow-Credentials': true
				},
				// credentials: 'same-origin',
				// redirect: 'follow', // manual, *follow, error
				// referrer: 'no-referrer', // no-referrer, *client
				timeout: 60000,
				responseType: 'json',
				withCredentials: true,
		  }
		: /* DEV CONFIG */
		  {
				baseURL: config.URL,
				headers: {
					'Content-Type': 'application/json',
				},
				timeout: 60000,
				responseType: 'json',
				withCredentials: true,
		  };

/**
 * Runtime AXIOS instance
 */
export const API = axios.create(AXIOS_DEFAULT_SETTINGS);
