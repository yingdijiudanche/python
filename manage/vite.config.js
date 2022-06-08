import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import autoUpdateRoute from './plugin/auto-update-route'
import updateRoute from './plugin/config/update-route'
import macrosPlugin from 'vite-plugin-babel-macros'
import windiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    windiCSS(),
    macrosPlugin(),
    autoUpdateRoute(updateRoute),
  ],
  define: {
    'process.env': {},
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'],
        },
      },
    },
  },
})
