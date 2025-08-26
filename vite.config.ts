import react from '@vitejs/plugin-react-swc';
import path from 'path';
import license from 'rollup-plugin-license';
import { defineConfig, loadEnv, PluginOption } from 'vite';
import checker from 'vite-plugin-checker';
import commonjs from 'vite-plugin-commonjs';
import CSP from 'vite-plugin-csp';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import configCSP from './src/security/CSP';

const ASSETS_DIR = 'assets';
const CHUNK_FILE_NAMES = `${ASSETS_DIR}/js/chunk-[hash].js`;
const ENTRY_FILE_NAMES = `${ASSETS_DIR}/js/entry-[hash].js`;
const ASSETS_EXT = [
	{
		output: `${ASSETS_DIR}/css/asset-[hash][extname]`,
		regex: /\.css$/,
	},
	{
		output: `${ASSETS_DIR}/js/asset-[hash][extname]`,
		regex: /\.js$/,
	},
];

function processAssetFileNames(info: any): string {
	if (info && info.name) {
		const name = info.name as string;
		const result = ASSETS_EXT.find(a => a.regex.test(name));
		if (result) {
			return result.output;
		}
	}
	return `${ASSETS_DIR}/asset-[hash][extname]`;
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		base: env.VITE_APP_VITE_APP_PUBLIC_URL,
		server: {
			host: env.VITE_APP_HOST,
			port: Number(env.VITE_APP_PORT),
		},
		plugins: [
			react(),
			VitePWA({
				manifest: {
					name: 'ElpRossmann 3.0.0',
					short_name: 'ElpRossmann',
					theme_color: '#205de0',
					background_color: '#e0203f',
					display: 'standalone',
					orientation: 'portrait',
					scope: '/',
					start_url: '/',
					icons: [
						{
							src: 'images/icons/icon-72x72.png',
							sizes: '72x72',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-96x96.png',
							sizes: '96x96',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-128x128.png',
							sizes: '128x128',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-144x144.png',
							sizes: '144x144',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-152x152.png',
							sizes: '152x152',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-384x384.png',
							sizes: '384x384',
							type: 'image/png',
						},
						{
							src: 'images/icons/icon-512x512.png',
							sizes: '512x512',
							type: 'image/png',
						},
					],
				},
			}),
			license({
				thirdParty: {
					output: path.resolve(__dirname, './dist/license/app.license.txt'),
				},
			}),
			CSP(configCSP),
			tsconfigPaths(),
			commonjs(),
			checker({ typescript: true }),
		] as PluginOption[],
		test: {
			environment: 'jsdom',
			globals: true,
			setupFiles: './vitest.setup.ts',
		},
		resolve: {
			alias: [{ find: 'styles', replacement: path.resolve(__dirname, './src/styles') }],
		},
		css: {
			modules: {
				localsConvention: 'camelCaseOnly',
				generateScopedName: mode !== 'production' ? '[name]_[local]_[hash:base64:8]' : '[hash:base64:8]',
			},
		},
		build: {
			emptyOutDir: true,
			manifest: true,
			minify: true,
			sourcemap: false,
			commonjsOptions: {
				transformMixedEsModules: true,
			},
			modulePreload: {
				polyfill: false,
			},
			assetsDir: ASSETS_DIR,
			rollupOptions: {
				output: {
					chunkFileNames: CHUNK_FILE_NAMES,
					entryFileNames: ENTRY_FILE_NAMES,
					assetFileNames: processAssetFileNames,
				},
			},
		},
	};
});
