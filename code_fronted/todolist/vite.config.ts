// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url'; // 引入 Node.js 的路径工具

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // <--- 【关键配置 3】
      // 使用 fileURLToPath 和 node:url 确保路径是绝对路径且跨平台兼容
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});