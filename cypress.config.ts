import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: `http://192.168.1.111:3000`,
	},
	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
	},
	defaultCommandTimeout: 15000,
	requestTimeout: 15000,
});
