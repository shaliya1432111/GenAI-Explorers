import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/ica-api': {
        target: 'https://remea.ica.ibm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ica-api/, '/ica'),
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxying ICA request to:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ ICA Proxy response status:', proxyRes.statusCode);
          });
        }
      }
    }
  }
})

// Made with Bob
