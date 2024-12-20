import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['bootstrap'],
  },
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
    proxy: {
      '/quotes': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
