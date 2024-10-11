import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte()],
	test: {
		environment: 'jsdom', // This sets JSDOM as the environment
		globals: true // Optional: enables global access to 'describe', 'it', etc.
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib') // Resolve the $lib alias to src/lib
		}
	}
});
