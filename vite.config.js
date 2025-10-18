import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  // Netlify dùng base: '/', GitHub Pages dùng base: '/happy-space/'
  base: process.env.NETLIFY === 'true' ? '/' : '/happy-space/',
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com/macros/s/AKfycbzoPppn3AMcg4JqQ01_HCCarFS9swPUKWIHKWW6U_fh-2SuWHaW7RVvUidhlAe2PMia0g/exec?key=dcce11e001864b07bade5343a64e8e29',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        followRedirects: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
}))