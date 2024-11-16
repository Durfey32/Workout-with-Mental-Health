import { defineConfig } from 'vite';
<<<<<<< HEAD
=======
import react from '@vitejs/plugin-react';
>>>>>>> 9be4df3d02cf10d0c26d98e55135877229029640

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
       target: 'http://localhost:3001',
       changeOrigin: true,
       secure: false,
    },
  },
},
=======
  plugins: [react()],
  server: {
    port: 3000,
    host: '127.0.0.1',
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
>>>>>>> 9be4df3d02cf10d0c26d98e55135877229029640
});
