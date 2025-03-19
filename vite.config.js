import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/senior/backend': {
        target: 'http://localhost', // Make sure this matches your backend URL
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS
        rewrite: (path) => path.replace(/^\/senior\/backend/, '/senior/backend'), // Adjust path if needed
      },
    },
  },
});
