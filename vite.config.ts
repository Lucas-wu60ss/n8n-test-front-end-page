import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { ENV } from './src/apps/global/const';

export default defineConfig(({ mode }) => {
	const isProd = mode === 'production';

	return {
		base: isProd ? `/${ENV.REPO_NAME}/` : '/',
		plugins: [tailwindcss(), react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			host: true,
			allowedHosts: ['localhost', '.trycloudflare.com'],
			proxy: {
				'/n8n': {
					target: 'http://localhost:5678',
					changeOrigin: true,
					rewrite: (p) => p.replace(/^\/n8n/, ''),
				},
			},
		},
	};
});
