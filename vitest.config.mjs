import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    globals: true,
    exclude: ['node_modules/**', 'backend/**'],
    env: {
      VITE_API_URL: 'http://localhost:5000/api',
    },
  },
});
