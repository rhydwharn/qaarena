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
        // In development, proxy API calls to the local backend
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        // Keep /api prefix as-is (matches backend routes: /api/*)
      }
    }
  }
}));