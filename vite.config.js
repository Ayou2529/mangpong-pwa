import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import { resolve } from 'path'

export default defineConfig({
  base: '/mangpong-pwa/',
  plugins: [
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  server: {
    mimeTypes: {
      '.js': 'application/javascript',
    }
  }
})