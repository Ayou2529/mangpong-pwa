import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/mangpong-pwa/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        edit: 'edit.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    // Proxy configuration to handle CORS issues with Google Apps Script during development
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});