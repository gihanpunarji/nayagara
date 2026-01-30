import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/payhere': {
        target: 'https://www.payhere.lk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/payhere/, '')
      },
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    },
    host: true // Listen on all local IPs to support subdomains like sellers.localhost
  }
})
