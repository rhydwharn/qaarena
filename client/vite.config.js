import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react()],
  // Use root base in both dev and build so the app works at https://qaarena.online/
  base: '/',
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://korrekttech.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/backend/api'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying request to:', proxyReq.path);
          });
        }
      }
    }
  }
}));