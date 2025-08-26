import '@fontsource/roboto';
import { APP_NAME } from 'config/version';
import ReactDOM from 'react-dom';
import { API } from './api/axios';
import initAxiosInterceptors from './api/axiosInterceptors';
import App from './App';
import './i18n/i18n';

export const IS_BRANDED = import.meta.env.VITE_APP_NODE_ENV === 'production';

const getWindowTitle = (): string => {
	const PRODUCTION_TITLE = `${APP_NAME} - system BMS`;
	const DEV_TITLE = `[DEV] ${APP_NAME} - system BMS`;

	if (IS_BRANDED) {
		return PRODUCTION_TITLE;
	} else {
		return DEV_TITLE;
	}
};

const initialize = (): void => {
	initAxiosInterceptors(API);
	if (import.meta.env.VITE_APP_NODE_ENV !== 'production') {
		const LOCALHOST_INCORRECT_HOST = `localhost`;
		if (window.location.href.includes(LOCALHOST_INCORRECT_HOST)) {
			window.location.href = `http://${import.meta.env.VITE_APP_HOST}:3000`;
		}
	}

	const title = getWindowTitle();
	document.title = title;
};

initialize();
ReactDOM.render(<App />, document.getElementById('root'));
