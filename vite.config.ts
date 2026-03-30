import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import alias from './configs/alias';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  console.log('🚀 ~ isDevelopment:', isDevelopment);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias,
    },
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: 'http://localhost:4000', // 目标后端服务
          changeOrigin: true, // 开启跨域
        },
      },
    },
  };
});
