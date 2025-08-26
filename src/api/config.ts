const config = {
	URL: `/api`,
};

export function getConfigURLServer(): string {
	let host = `${import.meta.env.VITE_APP_API_HOST || `${window.location.protocol}//${window.location.hostname}`}`;

	if (!import.meta.env.VITE_APP_API_HOST && import.meta.env.VITE_APP_NODE_ENV === 'production') {
		host = `https://${window.location.hostname}`;
	}

	const port = import.meta.env.VITE_APP_INCLUDE_API_PORT === 'true' ? `:${import.meta.env.VITE_APP_API_PORT}` : '';
	const url = `${host}${port}${import.meta.env.VITE_APP_API_PATH}`;
	return url;
}

config.URL = getConfigURLServer();

export default config;
