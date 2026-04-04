import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        // /api/lockers -> /api/v1/lockers
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
})
