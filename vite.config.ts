import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import alias from './configs/alias';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  console.log('🚀 ~ isDevelopment:', isDevelopment);

  return {
    plugins: [react()],
    resolve: {
      alias,
    },
  };
});
