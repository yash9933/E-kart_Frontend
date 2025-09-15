import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export default defineConfig({
  root: resolve(dirname(fileURLToPath(import.meta.url)), 'frontend'),
  publicDir: resolve(dirname(fileURLToPath(import.meta.url)), 'frontend', 'public'),
  plugins: [
    react({
      include: [/\.jsx?$/, /\.tsx?$/]
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: resolve(dirname(fileURLToPath(import.meta.url)), 'frontend', 'dist'),
    emptyOutDir: true,
  },
});


